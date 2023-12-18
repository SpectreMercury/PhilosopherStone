import React, { useState, useEffect, useCallback } from 'react';
import Select from '../common/Select/Select';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

const selectOptions = [
  { value: 'box1', label: 'Box 1' },
  { value: 'box2', label: 'Box 2' },
  { value: 'box3', label: 'Box 3' },
  { value: 'box4', label: 'Box 4' },
];

interface UploadedImage {
  file: File;
  preview: string;
}

const CreateGift: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setUploadedImages(current => [...current, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleRemoveImage = (index: number) => {
    setUploadedImages(current => current.filter((_, idx) => idx !== index));
  };

  useEffect(() => {
    return () => {
      uploadedImages.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [uploadedImages]);

  const handleSelectChange = (value: string) => {
    setSelectedOption(value);
  };

  return (
    <div>
      <p className='text-white001 font-SourceSanPro font-normal mb-2'>Assign to a blind box(optional)</p>
      <Select options={selectOptions} onSelect={handleSelectChange} />
      <div {...getRootProps()} className="border-dashed h-[280px] rounded-md border-2 border-gray-300 p-4 mt-4 text-center">
        <input {...getInputProps()} />
        {
          isDragActive ?
            (<Image
              src='/svg/image-uploader.svg'
              width={99}
              height={99}
              alt='uploader'/>): (<>
                <div className='h-full flex flex-col items-center justify-center'>
                  <Image
                    src='/svg/image-uploader.svg'
                    width={99}
                    height={99}
                    alt='uploader'/>
                  <p className='mt-8 mb-1 text-white001 font-bold font-SourceSanPro'>Click To Upload</p>
                  <p className='text-white004 font-SourceSanPro'>Maximum file size: 300 KB</p>
                </div>
              </>)
        }
      </div>
      <div className="mt-4 max-h-[300px] overflow-auto">
        {uploadedImages.map((image, index) => (
          <div key={index} className="bg-primary008 px-4 py-2 rounded-md flex items-center justify-between my-2">
            <img src={image.preview} alt={`uploaded ${index}`} className="w-16 h-16 object-cover" />
            <div>
              <p className='w-32 text-white001 text-body1mb font-semibold font-SourceSanPro overflow-hidden overflow-ellipsis whitespace-nowrap'>{image.file.name}</p>
              <p className='text-white004 text-body1mb font-SourceSanPro'>{(image.file.size / 1024).toFixed(2)} KB</p>
            </div>
            <div onClick={() => handleRemoveImage(index)}>
              <Image 
                src='/svg/remove-upload.svg'
                width={32}
                height={32}
                alt='remove-upload'
              />
            </div>
          </div>
        ))}
      </div>
      <button 
        className={`w-[340px] h-[48px] bg-white001 border border-primary003 font-PlayfairDisplay text-primary011 py-2 px-4 rounded w-full mt-4 ${file ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500'}`}
        disabled={!file}
      >
        Create Gift
      </button>
    </div>
  );
};

export default CreateGift;
