'use client'; 

import Button from '@/app/components/Button';
import Input from '@/app/components/Inputs/Input';
import React, { useCallback, useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm} from 'react-hook-form'
import AuthSocialButons from './AuthSocialButons';
import {BsGithub, BsGoogle} from 'react-icons/bs';
import axios from "axios";
import {signIn, useSession} from "next-auth/react";
import { toast } from 'react-hot-toast';
import {useRouter} from 'next/navigation';

type Varient = 'LOGIN' | 'REGISTER';

const AuthForm = () => {
    const session = useSession();
    const router = useRouter();
    const [varient,setVarient] = useState<Varient>('LOGIN');
    const [isLoading,setIsLoading] = useState<boolean>(false);

    useEffect(()=>{
      if(session?.status === 'authenticated'){
        router.push('/users');
      }
    },[session?.status,router]);

    const toggleVarient = useCallback(()=>{
        varient === 'LOGIN' ? setVarient('REGISTER') : setVarient('LOGIN')
    },[varient]);

    const {register,handleSubmit,formState:{errors}} = useForm<FieldValues>({
        defaultValues:{  
            name:"",
            email:"",
            password:""
        }
    })

    const onSubmit: SubmitHandler<FieldValues>=(data)=>{
      setIsLoading(true);

      if(varient === 'REGISTER'){
        axios.post('/api/register',data)
        .then(()=>signIn('credentials',data))
        .catch(()=>toast.error("Something went wrong! :("))
        .finally(()=>setIsLoading(false))
      }

      if(varient === 'LOGIN'){
        signIn('credentials',{
          ...data,
          redirect:false
        })
        .then((callback)=>{
          if(callback?.error){
            toast.error('Invalid credentials');
          }
          if(callback?.ok && !callback?.error){
            toast.success('Logged in succesfully :)');
            router.push('/users');
          }
        })
        .finally(()=>setIsLoading(false));
      }
    }
    const socialAction = (action:string)=>{
      setIsLoading(true);
      signIn(action,{redirect:false})
      .then((callback)=>{
        if(callback?.error){
          toast.error('Invalid credentials');
        }   
        if(callback?.ok && !callback?.error){
          toast.success('Logged in succesfully :)');
          router.push('/users');
        }
      })
      .finally(()=>setIsLoading(false));
    }

  return (
    <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
      <div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
        <form 
          className='space-y-6'
          onSubmit={handleSubmit(onSubmit)}
          >
            {varient === "REGISTER" && (
            <Input 
               id="name" 
               label="Name" 
               register={register}
               errors={errors}
            />)}
            <Input 
               id="email" 
               label="Email" 
               type="email"
               register={register}
               errors={errors}
            />
            <Input 
               id="password" 
               label="Password" 
               type="password"
               register={register}
               errors={errors}
            />
          <div>
            <Button
              disabled={isLoading}
              type='submit'
              fullWidth
            >
              {varient === 'LOGIN' ? 'Sign In' : 'Register'}
            </Button>
          </div>
        </form>

        <div className='mt-6'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'/>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='bg-white px-2 text-gray-500'>
                  Or continue with
                </span>
              </div>
            </div>

            <div className='mt-6 flex gap-2'>
              <AuthSocialButons 
                icon={BsGithub} 
                onClick={()=>socialAction('github')}
              />
              <AuthSocialButons 
                icon={BsGoogle} 
                onClick={()=>socialAction('google')}
              />
            </div>
        </div>

        <div
          className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'
        >
          <div>
            {varient === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'}
          </div>
          <div
            onClick={toggleVarient}
            className='underline cursor-pointer'
          >
            {varient === 'LOGIN' ? 'Create an account' : 'Login'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthForm