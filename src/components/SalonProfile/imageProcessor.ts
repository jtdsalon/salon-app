export const optimizeImage = async (file: File, config: { maxWidth: number, quality: number }): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > config.maxWidth) {
          height *= config.maxWidth / width;
          width = config.maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert canvas to blob and then to File
        canvas.toBlob((blob) => {
          if (blob) {
            const optimizedFile = new File([blob], file.name, { type: 'image/jpeg' });
            resolve(optimizedFile);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        }, 'image/jpeg', config.quality);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
