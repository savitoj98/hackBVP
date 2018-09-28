import cv2
import numpy as np


dataset = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

font = cv2.FONT_HERSHEY_SIMPLEX


#face_1 = np.load('face_1.npy')
#print(np.size(face_1))
face_1 = np.load('Manas.npy').reshape(20,50*50*3)
face_2 = np.load('Dev.npy').reshape(20,50*50*3)
face_3 = np.load('Virendra Uncle (met in DTC).npy').reshape(20,50*50*3)
face_4 = np.load('Nupur Bhabhi.npy').reshape(20,50*50*3)
face_5 = np.load('Vicky Bhaiya.npy').reshape(20,50*50*3)
face_6 = np.load('GEETA DI.npy').reshape(20,50*50*3)
face_7 = np.load('Tai.npy').reshape(20,50*50*3)
face_8 = np.load('Krishna.npy').reshape(20,50*50*3)
face_9 = np.load('Kriti.npy').reshape(20,50*50*3)
face_10 = np.load('Garvit.npy').reshape(20,50*50*3)
face_11 = np.load('Prathu.npy').reshape(20,50*50*3)
face_12 = np.load('Ujjwal.npy').reshape(20,50*50*3)
face_13 = np.load('Prakhar.npy').reshape(20,50*50*3)
face_14 = np.load('Sahni.npy').reshape(20,50*50*3)
face_15 = np.load('Vidhi.npy').reshape(20,50*50*3)
face_16 = np.load('KK.npy').reshape(20,50*50*3)
face_17 = np.load('Rajinder Uncle.npy').reshape(20,50*50*3)
face_18 = np.load('Prakshal.npy').reshape(20,50*50*3)
face_19 = np.load('Anoop_Bhaiji.npy').reshape(20,50*50*3)




users = {
        0 : 'Manas',
        1 : 'Dev',
        2 : 'Virendra Uncle (met in DTC)',
        3 : 'Nupur Bhabhi',
        4 : 'Vicky Bhaiya',
        5 : 'Geeta Di',
        6 : 'Tai',
        7 : 'Krishna',
        8 : 'Kriti',
        9 : 'Garvit',
        10 : 'Prathu',
        11 : 'Ujjwal',
        12 : 'Prakhar',
        13 : 'Sahni',
        14 : 'Vidhi',
        15 : 'KK',
        16 : 'Rajinder Uncle',
        17 : 'Prakshal',
        18 : 'Anoop Bhaiji'
        }


labels = np.zeros((380,1))                   #dont write (60,0)
labels[0:20,:] = 0.0
labels[20:40,:] = 1.0
labels[40:60,:] = 2.0
labels[60:80,:] = 3.0
labels[80:100,:] = 4.0
labels[100:120,:] = 5.0
labels[120:140,:] = 6.0
labels[140:160,:] = 7.0
labels[160:180,:] = 8.0
labels[180:200,:] = 9.0
labels[200:220,:] = 10.0
labels[220:240,:] = 11.0
labels[240:260,:] = 12.0
labels[260:280,:] = 13.0
labels[280:300,:] = 14.0
labels[300:320,:] = 15.0
labels[320:340,:] = 16.0
labels[340:360,:] = 17.0
labels[360:380,:] = 18.0



data = np.concatenate([face_1,face_2,face_3,face_4,face_5,face_6,face_7,face_8,face_9,face_10,face_11,face_12,face_13,face_14,face_15,face_16,face_17,face_18,face_19])
print(data.shape)


def distance(x1,x2):
    return np.sqrt(sum((x1-x2)**2))

def knn(x,train,k=3):
    m = train.shape[0]                  #shape[0] gives the rows 
    dist = []
    
    for i in range(m):
#        print("X is ",x)
#        print("Train data is ",train[i])
        dist.append(distance(x,train[i]))
#        print("Distance is ",dist[i])
    
    dist = np.asarray(dist)
#    print(dist)
    index = np.argsort(dist)
#    print(index)
    sorted_labels = labels[index][:k]
#    print(sorted_labels)
    count = np.unique(sorted_labels,return_counts=True)
#    print(count)
#    print(count[0][np.argmax(count[1])])
    return count[0][np.argmax(count[1])]
    

capture = cv2.VideoCapture(0)

while True:
    ret,img = capture.read()
    
    if ret:
        gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
        faces = dataset.detectMultiScale(gray,1.3)
#        print(type(faces))
        
        
        for x,y,w,h in faces:
            face_comp = img[y:y+h,x:x+w,:]
            face_comp = cv2.resize(face_comp,(50,50))
            print(np.size(face_comp))
            print(face_comp.shape)
            lab = knn(face_comp.flatten(),data)
            text = users[int(lab)]
            
            cv2.putText(img,text,(x,y),font,1,(200,200,0),3)
            cv2.rectangle(img,(x,y),(x+w,y+h),(200,200,0),6)
        
        cv2.imshow('img',img)
        
    else:
        print('Camera Issue')
    
    k = cv2.waitKey(1) & 0xFF
    if k==27:
        break
    
capture.release()
cv2.destroyAllWindows()

