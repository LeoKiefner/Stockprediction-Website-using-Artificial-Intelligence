import os
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler

dataset_train = pd.read_csv("../public/Data/NVDA.csv")
dataset_train.head()

training_set = dataset_train.iloc[:,1:2].values

print(training_set)
print(training_set.shape)

scaler = MinMaxScaler(feature_range=(0,1))
scaled_training_set = scaler.fit_transform(training_set)

scaled_training_set


