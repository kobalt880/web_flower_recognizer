from keras.models import load_model
from keras.preprocessing.image import img_to_array, smart_resize
from keras.layers import Softmax
import keras.ops.image as images

import numpy as np
from PIL import Image
from io import BytesIO

CLASSES = ['Колокольчик', 'Ромашка', 'Одуванчик', 'Лотос', 'Роза', 'Подсолнух', 'Тульпан']
MODEL_PATH = 'ai/model.keras'


class FlowersModel:
    def __init__(self, count_of_classes_to_show: int):
        self.__model = self.__create_model()
        self.__cocts = count_of_classes_to_show

        if self.__cocts > len(CLASSES) or self.__cocts < 1:
            raise ValueError('Count of classes to show should be between 1 and 7 inclusive')

    def __image_preprocessing(self, image_data: str | bytes) -> np.ndarray:
        if isinstance(image_data, str):
            image_data = image_data.encode()

        img = Image.open(BytesIO(image_data)).convert('RGB')
        img: np.ndarray = smart_resize(img_to_array(img), (100, 100))
        return np.array([img.tolist()]) / 255

    def __create_model(self) -> callable:
        model = load_model(MODEL_PATH)
        softmax = Softmax()
        return lambda x: softmax(model(x))

    def __call__(self, img_data: str | bytes) -> tuple[str, str]:
        '() -> ("pred_1, pred_2, ... pred_n", "conf_1, conf_2, ... conf_n")'

        image = self.__image_preprocessing(img_data)
        prediction: np.ndarray = self.__model(image).numpy().squeeze()
        preds = []
        confs = []

        for _ in range(self.__cocts):
            index = prediction.argmax()
            confidence = round(prediction[index].item() * 100, 2)
            pred_class = CLASSES[index]
            prediction[index] = -1

            preds.append(pred_class)
            confs.append(str(confidence))

        return (', '.join(preds), ', '.join(confs))
