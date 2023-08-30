'use client'

import { User } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Field, FieldValue, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Modal from '../Modal';
import Input from '../Inputs/Input';
import Image from 'next/image';
import { CldUploadButton } from 'next-cloudinary';
import Button from '../Button';

interface SettingsModalProps {
    isOpen?: boolean;
    onClose: () => void;
    currentUser: User;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen,
    onClose,
    currentUser
}) => {

    const router = useRouter();
    const [isLoadng,setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: currentUser?.name,
            image: currentUser?.image
        }
    });

    const image = watch('image');

    const handleUpload = (result: any) => {
         setValue('image', result?.info?.secure_url,{
            shouldValidate: true
         })
    }

    const onSubmit: SubmitHandler<FieldValues> = (data)=>{
        setIsLoading(true);

        axios.post('/api/settings', data)
        .then(()=>{
            router.refresh();
            onClose();
        })
        .catch(()=> toast.error('Something went wrong!'))
        .finally(()=> setIsLoading(false))
    }

  return (
    <Modal 
     onClose={onClose}
     isOpen={isOpen}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-12'>
         <div className='border-b border-gray-900/10 pb-12'>
          <h2 className='text-base font-semibold leading-6 text-gray-900'>
            Profile
          </h2>
          <p className='mt-1 text-sm leading-6 text-gray-600'>
            Edit your public details
          </p>
          <div className='mt-10 flex flex-col gap-y-8'>
            <Input
             disabled={isLoadng}
             label='Name'
             id="name"
             errors={errors}
             register={register}
            />
            <div>
                <label className='block text-sm font-medium leading-6 text-gray-900'>
                 Photo
                </label>
                <div className='mt-2 flex items-center gap-x-3'>
                 <Image
                    width="48"
                    height="48"
                    className='rounded-full'
                    src={image || currentUser?.image || '/images/placeholder.png'}
                    alt='Avatar'
                 />
                 <CldUploadButton 
                  options={{  maxFiles:1 }}
                  onUpload={handleUpload}
                  uploadPreset="kyk1inli"
                 >
                  <Button 
                     disabled={isLoadng}
                     secondary
                     type='button'
                  >
                    Change
                  </Button>
                </CldUploadButton> 
                </div>
            </div>
          </div>
         </div>
         <div className='mt-6 flex items-center justify-end flex-x-6'>
            <Button
             disabled={isLoadng}
             secondary
             onClick={onClose}
            >
                Cancel
            </Button>
            <Button
             disabled={isLoadng}
              type='submit'
            >
                Save
            </Button>
         </div>
        </div>
      </form>
    </Modal>
  )
}

export default SettingsModal



