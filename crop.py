import cv2
import numpy as np

# Load image and convert to include alpha channel
image_bgr = cv2.imread('default.jpg')
image = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2BGRA)
clone = image.copy()

drawing = False
ix, iy = -1, -1

def draw_rectangle(event, x, y, flags, param):
    global ix, iy, drawing, image

    if event == cv2.EVENT_LBUTTONDOWN:
        drawing = True
        ix, iy = x, y

    elif event == cv2.EVENT_MOUSEMOVE:
        if drawing:
            temp_img = image.copy()
            cv2.rectangle(temp_img, (ix, iy), (x, y), (0, 255, 0, 255), 1)
            cv2.imshow('Image', temp_img)

    elif event == cv2.EVENT_LBUTTONUP:
        drawing = False
        x1, y1 = min(ix, x), min(iy, y)
        x2, y2 = max(ix, x), max(iy, y)
        # Set alpha channel to 0 for transparency
        image[y1:y2, x1:x2, 3] = 0
        cv2.imshow('Image', image)

cv2.namedWindow('Image')
cv2.setMouseCallback('Image', draw_rectangle)

while True:
    cv2.imshow('Image', image)
    key = cv2.waitKey(1) & 0xFF
    if key == ord('r'):
        image = clone.copy()
    elif key == ord('q') or key == 27:
        break

cv2.destroyAllWindows()
