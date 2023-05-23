import ImageCropPicker from 'react-native-image-crop-picker';

const settings = {
  width: 300,
  height: 300,
  cropping: true,
  forceJpg: true,
  compressImageQuality: 0.8,
};

const picker = () => {
  return ImageCropPicker.openPicker(settings);
};

const camera = () => {
  return ImageCropPicker.openCamera(settings);
};

export default {
  camera,
  picker,
};
