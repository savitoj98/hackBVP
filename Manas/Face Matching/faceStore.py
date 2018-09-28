import cv2
import numpy as np
#from PIL import Image

dataset = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

cap = cv2.VideoCapture(0)

data = []
#i=0
while True:
    ret,img = cap.read()
    if ret:
        gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)
        faces = dataset.detectMultiScale(gray,1.3)
                      
        for x,y,w,h in faces:
            face_comp = img[y:y+h,x:x+w,:]
            face_comp = cv2.resize(face_comp,(50,50))
            
#            i=i+1
#            name='Manas'+str(i)+'.jpg'
#            cv2.imwrite(name,face_comp)
#            print(type(img))
#            print(type(face_comp))
            
            if x % 10 == 0 and len(data)<=20:
                data.append(face_comp)
                print(type(data))
                print(len(data))
                #print(data)
                
            cv2.rectangle(img,(x,y),(x+w,y+h),(255,0,255),5)

        cv2.imshow('img',img)
        
    else:
        print('Some error')
        
    
    k = cv2.waitKey(1) & 0xFF
    if k==27 or len(data)==20:
        break

#cv2.imwrite('faces.jpg',data)                  #dont do this otherwise the kernel will stop             
#cv2.imshow('faces',data)                       ##dont do this otherwise the kernel will stop
data = np.asarray(data)
#print(type(data))

#newFace = 'New Face Data'+ str(np.randint(5));
#np.save(newFace,data)
np.save('Anoop_Bhaiji',data)

#cv2.imshow('faces',data)
#all_faces = Image.fromarray(data,'RGB')
#all_faces.save('all_face.jpg')


cap.release()
cv2.destroyAllWindows()




