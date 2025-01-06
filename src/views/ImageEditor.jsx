import React, { useEffect, useRef, useState } from 'react';
import image from '../assets/images/image.png';
import { Cropper } from 'react-cropper';
import { Button, Form, Modal } from 'react-bootstrap';

const ImageEditor = () => {
  const canvasRef = useRef(null);
  const cropperRef = useRef(null);
  const [replacementImage, setReplacementImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [userText, setUserText] = useState('');

  const handleReplacementImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setReplacementImage(reader.result);
        setShowCropper(true);
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleCropDone = () => {
    const cropper = cropperRef.current.cropper;
    const croppedCanvas = cropper.getCroppedCanvas({
      width: 1000,
      height: 1000,
    });
    const croppedDataURL = croppedCanvas.toDataURL('image/jpeg', 1.0);
    setCroppedImage(croppedDataURL);
    setShowCropper(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const originalImg = new Image();
    originalImg.src = image;
    originalImg.onload = () => {
      canvas.width = originalImg.width;
      canvas.height = originalImg.height;
      ctx.drawImage(originalImg, 0, 0);
    };
  }, []);

  const getCroppedImgFunc = () => {
    if (croppedImage) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const croppedImg = new Image();
      croppedImg.src = croppedImage;
  
      croppedImg.onload = () => {
        // const croppedImg = new Image();
        // croppedImg.src = croppedImage;
        // croppedImg.onload = () => {
        //   ctx.drawImage(croppedImg, 223, 600, 533, 592);
        // };

        const x = 2600; // X-coordinate of the image
        const y = 950; // Y-coordinate of the image
        const width = 950; // Width of the image
        const height = 1020; // Height of the image
        const radius = 30;
  
        const drawRoundedRect = (ctx, x, y, width, height, radius) => {
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + width - radius, y);
          ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
          ctx.lineTo(x + width, y + height - radius);
          ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
          ctx.lineTo(x + radius, y + height);
          ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
        };
  
        ctx.save();
        drawRoundedRect(ctx, x, y, width, height, radius);
        ctx.clip();
        ctx.drawImage(croppedImg, x, y, width, height);
        ctx.restore();
      };
    }
  }
  
  useEffect(() => {
    if (croppedImage) {
      getCroppedImgFunc();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [croppedImage]);
  

  const handleDownload = () => {
    const canvas = canvasRef.current;

    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = canvas.width * 2;
    scaledCanvas.height = canvas.height * 2;
    const scaledCtx = scaledCanvas.getContext('2d');

    scaledCtx.scale(2, 2);
    scaledCtx.drawImage(canvas, 0, 0);

    const image = scaledCanvas.toDataURL('image/jpeg', 1.0);
    const link = document.createElement('a');
    link.href = image;
    link.download = 'image.jpg';
    link.click();
  };

  const handleClose = () => {
    setShowCropper(false);
  };

  const handleAddText = () => {
    setShowTextModal(true);
  };

  const handleTextSubmit = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const originalImg = new Image();
    originalImg.src = image;
    originalImg.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(originalImg, 0, 0);
      if (croppedImage) {
        getCroppedImgFunc();
        // const croppedImg = new Image();
        // croppedImg.src = croppedImage;
        // croppedImg.onload = () => {
        //   ctx.drawImage(croppedImg, 1200, 1800, 500, 510);
        // };
      }
      const fontSize = 100;
      ctx.font = `bold ${fontSize}px 'Franklin Gothic Demi', Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
  
      const textX = 3070;
      const textY = 2160;
  
      ctx.fillStyle = 'black';
      ctx.fillText(userText, textX, textY);
    };
  
    setShowTextModal(false);
  };
  

  return (
    <div style={{ margin: '30px' }}>
      <h2>Image Editor</h2>
      <Button onClick={handleAddText} variant="primary" className='me-2 my-2'>
        Add Name
      </Button>
      <input type="file" accept="image/*" onChange={handleReplacementImageUpload} />
      {showCropper && (
        <Modal style={{ marginTop: '20px', width: '100vw' }} show={replacementImage} >
          <Modal.Dialog>
          <Modal.Header closeButton onClick={handleClose}>
            <Modal.Title>Crop Your Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Cropper
              src={replacementImage}
              style={{ height: 400, width: '100%' }}
              aspectRatio={1}
              guides={false}
              ref={cropperRef}
              viewMode={1}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
            <Button variant="primary" onClick={handleCropDone}>Done</Button>
          </Modal.Footer>
        </Modal.Dialog>
        </Modal>
      )}
     <div
        style={{
          width: '100%',
          maxWidth: '90vw',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            border: '1px solid black',
            marginTop: '10px',
            width: '100%',
            height: 'auto',
          }}
        ></canvas>
      </div>
      <Button onClick={handleDownload} variant='success' disabled={!(userText && croppedImage)}>Download Image</Button>
      <Modal show={showTextModal} onHide={() => setShowTextModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Name</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Enter Name</Form.Label>
            <Form.Control
              type="text"
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="Enter your text"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTextModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleTextSubmit}>
            Add Name
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ImageEditor;
