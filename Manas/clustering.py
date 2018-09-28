import numpy as np
import matplotlib.pyplot as plt
from scipy.cluster.vq import kmeans2, whiten

usr_data = np.array

x, y = kmeans2(whiten(coordinates), 3, iter = 20)
plt.scatter(coordinates[:,0], coordinates[:,1], c=y);
plt.show()



