import numpy as np
from scipy.cluster.vq import kmeans2, whiten
import json

with open("dummy1.json") as f:
    data = json.load(f)
    print(type(data))

i = 0
usr_prob = np.ndarray((1334,5))
for usr in data:
    usr_prob[i] = usr["problems"]
    i += 1
# print(i)
# print(usr_prob)

# print(data)


# usr_data = np.array(usr_prob)

x, y = kmeans2(whiten(usr_prob), 5, iter = 20)

# y.dtype = np.int64
print(type(y))
y = y.tolist()
# print(x)
print(y[0])
print(len(y))
#
# # print(data["coordinates"]["lat"])
#
j = 0

locn_cluster = {"lat" : [],
            "long" : [],
            "cluster" : []}
# print(len(y))

for usr in data:
    locn = usr["coordinate"]
    # print(locn)
    locn_cluster["lat"].append(locn["lat"])
    locn_cluster["long"].append(locn["long"])
    
    locn_cluster["cluster"].append(y[j])
    j += 1
    
#
#
print(locn_cluster)
#
# print(len(locn_cluster["lat"]))
# print(len(locn_cluster["long"]))
# print(len(locn_cluster["cluster"]))
# #
#
# # print(lat)
#
#
# # usr_lbl = {"lat" : lat,
# #            "long" : long,
# #            "cluster" : y}
# # print(usr_lbl["lat"])
#
#
# json = [json.dumps(locn_cluster) for k,v in locn_cluster.items()]
# # print(json)
# f = open("locn_cluster", "w")
# f.write(json)
# f.close()

with open("data.json", "w") as outfile:
    json.dump(locn_cluster, outfile)
# r = json.dumps(locn_cluster)



