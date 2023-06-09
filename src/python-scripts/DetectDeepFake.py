import sys
import os
import cv2
import face_recognition
from PIL import Image
import requests
import shutil
import numpy as np
import torch
from progress.bar import Bar
from statistics import mean
import time
import datetime
import json
import firebase_admin
from firebase_admin import credentials
from firebase_admin import storage
from google.cloud import storage
from efficient_vit1 import EfficientViT
# cred = credentials.Certificate("E:\AI-PBL\PBL\ViT\\videocall1.json")
# firebase_admin.initialize_app(cred, {
#     'storageBucket': 'videocall1-51243.appspot.com'
# })
# os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = "E:\AI-PBL\PBL\ViT\\videocall1.json"


# def upload_image(image_path, destination):
#     bucket = storage.bucket()

#     blob = bucket.blob(destination)
#     blob.upload_from_filename(image_path)

#     print('Hình ảnh đã được tải lên thành công.')


# def delete_folder(bucket_name, folder_path):
#     client = storage.Client()
#     bucket = client.get_bucket(bucket_name)

#     blobs = bucket.list_blobs(prefix=folder_path)

#     for blob in blobs:
#         blob.delete()

#     print('Thư mục đã được xóa thành công.')


resize_x = 224
resize_y = 224


def download_video(url, save_dir, video_name):
    response = requests.get(url, stream=True)
    response.raise_for_status()

    # Tạo đường dẫn lưu trữ tự động
    save_path = os.path.join(save_dir, video_name+".mp4")

    # Tạo thư mục lưu trữ nếu chưa tồn tại
    os.makedirs(save_dir, exist_ok=True)

    with open(save_path, 'wb') as file:
        for chunk in response.iter_content(chunk_size=8192):
            file.write(chunk)


def download_img(url, save_dir, image_name):
    response = requests.get(url, stream=True)
    response.raise_for_status()
    print(url, save_dir, image_name)
    # Tạo đường dẫn lưu trữ tự động
    save_path = os.path.join(save_dir, image_name)
    # save_path = os.path.join(save_dir, image_name+".jpg")
    print(save_path)
    # Tạo thư mục lưu trữ nếu chưa tồn tại
    os.makedirs(save_dir, exist_ok=True)

    with open(save_path, 'wb') as file:
        for chunk in response.iter_content(chunk_size=8192):
            file.write(chunk)


def detect(img, new_path, imglist):
    image = face_recognition.load_image_file(img)
    face_locations = face_recognition.face_locations(image)
    if len(face_locations) == 0:
        return []
    # In this case: save the first face found in a pic
    # Get the location of each face in this image
    top, right, bottom, left = face_locations[0]
    face_image = image[top:bottom, left:right]
    pil_image = Image.fromarray(face_image)
    resized_face = pil_image.resize((resize_x, resize_y))
    (filename, extension) = os.path.splitext(imglist)
    resized_face.save(new_path+'/FR_'+filename+extension)


def detect_video(original_path, new_path):
    all_file_lists = os.listdir(original_path)
    folder_lists = []

    # find folders in allfilelists
    for all_file_list in all_file_lists:
        (filename, extension) = os.path.splitext(all_file_list)
        if extension == '':
            folder_lists.append(filename)
    print('# of folders: '+str(len(folder_lists)))
    print("Start !!!!!!!!!!!")

    for folder_list in folder_lists:
        temp_original_path = original_path+'/'+folder_list
        temp_new_path = new_path+'/'+folder_list
        if not os.path.exists(temp_new_path):
            os.mkdir(temp_new_path)

        imglists = os.listdir(temp_original_path)
        len_imglists = len(imglists)

        for imglist in imglists:
            img = temp_original_path+'/'+imglist
            (filename_img, extension_img) = os.path.splitext(img)
            if extension_img != '':
                # exclude error img
                if os.path.getsize(img) != 0:
                    detect(img, temp_new_path, imglist)
                else:
                    len_imglists -= 1


def detect_img(original_path, new_path):
    all_file_lists = os.listdir(original_path)
    img_lists = []

    # find folders in allfilelists
    for all_file_list in all_file_lists:
        (filename, extension) = os.path.splitext(all_file_list)
        if extension != '':
            img_lists.append(filename)
    print('# of folders: '+str(len(img_lists)))
    print("Start !!!!!!!!!!!")

    for img_list in img_lists:
        temp_new_path = original_path+'/'+img_list
        if not os.path.exists(temp_new_path):
            os.mkdir(temp_new_path)

        imglists = os.listdir(original_path)
        len_imglists = len(imglists)

        for imglist in imglists:
            img = original_path+'/'+imglist
            (filename_img, extension_img) = os.path.splitext(img)
            if extension_img != '':
                # exclude error img
                if os.path.getsize(img) != 0:
                    detect(img, temp_new_path, imglist)
                else:
                    len_imglists -= 1


def framing(input_path, output_path, video_name):
    download_video(input_path, output_path, video_name)
    videos = os.listdir(output_path)
    videos.sort(key=lambda x: x[:-4])

    if len(videos) != 0:
        video_num = 0
        for each_video in videos:
            print('Video {} is running ...'.format(video_num))
            each_video_input = input_path+'/'+str(each_video)
            each_video_output_path = output_path+'/'+str(each_video[:-4])
            if not os.path.exists(each_video_output_path):
                os.mkdir(each_video_output_path)

            capture = cv2.VideoCapture(each_video_input)
            if capture.isOpened():
                real = True
            else:
                real = False

            frame_step = 10
            frame_num = 0
            picture_num = 0

            while real:
                real, frame = capture.read()
                # fix blank img
                if real:
                    if(frame_num % frame_step == 0):
                        cv2.imwrite(each_video_output_path+'/Frame' +
                                    str(frame_num)+'_Pic'+str(picture_num)+'.jpg', frame)
                        picture_num += 1
                    frame_num += 1
    else:
        print('Empty Directory')


def get_data(data_dir, type):
    data = []
    path = os.path.join(data_dir)
    frames_paths_dict = {}
    for img in os.listdir(path):
        try:
            if(type == "img"):
                for i in range(0, len(os.listdir(path))):
                    frames_paths_dict.setdefault(i, []).append(img)
            else:
                for i in range(0, 9):
                    if("_Pic"+str(i) in img):
                        frames_paths_dict.setdefault(i, []).append(img)
        except Exception as e:
            print(e)
    video = {}
    print(frames_paths_dict)
    for key, frame_images in frames_paths_dict.items():
        for frame_image in frame_images:
            img_arr = cv2.imread(os.path.join(path, frame_image))[..., ::-1]
            if len(img_arr) > 0:
                video.setdefault(key, []).append(img_arr)
    data.append((video))
    return data


def custom_video_round(preds):
    totalReal = 0
    totalFake = 0
    for pred_value in preds:
        if pred_value > 0.55:
            totalFake += 1
        else:
            totalReal += 1
    if(totalFake/totalReal > 1):
        return 1
    else:
        return mean(preds)


def custom_round(values):
    result = []
    for value in values:
        if value > 0.55:
            result.append(1)
        else:
            result.append(0)
    return np.asarray(result)


def RunModel(path, type):
    dataset = get_data(path, type)
    start_time = time.time()
    modelTest = EfficientViT(channels=1280, selected_efficient_net=0)
    modelTest.load_state_dict(torch.load(
        'E:\AI-PBL\PBL\deepfake\\assets\\data\\EfficientViT_checkpoint_39.pt', map_location=torch.device('cpu')))
    modelTest.eval()
    modelTest = modelTest.cpu()
    bar = Bar('Predicting', max=len(dataset))
    preds = []
    for index, video in enumerate(dataset):
        video_faces_preds = []
        for key in video:
            faces_preds = []
            video_faces = video[key]
            for i in range(0, len(video_faces), 32):
                faces = video_faces[i:i+32]
                faces = torch.tensor(np.asarray(faces))
                if faces.shape[0] == 0:
                    continue
                faces = np.transpose(faces, (0, 3, 1, 2))
                faces = faces.cpu().float()
                # faces = faces.cuda().float()

                pred = modelTest(faces)

                scaled_pred = []
                for idx, p in enumerate(pred):
                    scaled_pred.append(torch.sigmoid(p))
                faces_preds.extend(scaled_pred)

            current_faces_pred = sum(faces_preds)/len(faces_preds)
            face_pred = current_faces_pred.cpu().detach().numpy()[0]
            video_faces_preds.append(face_pred)
        bar.next()
        print(video_faces_preds)
        if len(video_faces_preds) > 1:
            video_pred = custom_video_round(video_faces_preds)
        else:
            video_pred = video_faces_preds[0]
        print(video_pred)
        preds.append([video_pred])
    bar.finish()
    end_time = time.time()
    delta_time = datetime.timedelta(seconds=(end_time-start_time))
    print(preds)
    print('Running time using Face-recognition is: %s ' % (delta_time))
    accuracy = custom_round(np.asarray(preds))
    print(accuracy)


def delFolder(path):
    for filename in os.listdir(path):
        file_path = os.path.join(path, filename)
        if os.path.isdir(file_path):
            # Xóa thư mục con
            shutil.rmtree(file_path)
        else:
            # Xóa file
            os.remove(file_path)


if __name__ == '__main__':
    data_json = sys.argv[1]
    # Xử lý dòng văn bản
    print(data_json)
    data = json.loads(data_json)
    render_working_dir = os.environ.get('RENDER_WORKING_DIR')
    print(render_working_dir)
    out_path = 'E:\AI-PBL\PBL\ViT\dataset\\data'
    if(data["type"] == "img"):
        start_time = time.time()
        delFolder(out_path)
        download_img(data["url"], out_path, data["name"].split(".")[0])
        detect_img(out_path, out_path+"\\"+data["name"].split(".")[0])
        RunModel(out_path+"\\"+data["name"].split(".")[0], data["type"])
        end_time = time.time()
        delta_time = datetime.timedelta(seconds=(end_time-start_time))
        print('Running Python Code: %s ' % (delta_time))
    if(data["type"] == "video"):
        start_time = time.time()
        delFolder(out_path)
        framing(data["url"], out_path,  data["name"])
        detect_video(out_path, out_path+"\\" + data["name"])
        RunModel(out_path+"\\" + data["name"] +
                 "\\" + data["name"], data["type"])
        end_time = time.time()
        delta_time = datetime.timedelta(seconds=(end_time-start_time))
        print('Running Python Code: %s ' % (delta_time))
    # Gửi kết quả từ Python qua tiêu chuẩn đầu ra (stdout)
    sys.stdout.write("Du lieu tra ve")
    # upload_image(
    #     out_path+"/VideoUpload1636834236000/Frame0_Pic0.jpg", 'images/image.jpg')
    # delete_folder('videocall1-51243.appspot.com', 'ds')


#       .split(".")[0]
#       .split(".")[0]
#       .split(".")[0]
#       .split(".")[0]
