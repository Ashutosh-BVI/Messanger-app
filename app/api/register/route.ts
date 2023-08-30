import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";


export async function POST(request: Request){
 try{
  const body = await request.json();
  const {email,name,password} = body;

  if(!email || !name || !password){
    return new NextResponse('Missing Info...',{status:400})
  }
  const hashedPassword = await bcrypt.hash(password,12);

  const user = await prisma.user.create({
    data:{
        email,name,hashedPassword
    }
  });

  return NextResponse.json(user);
}catch(err){
    return new NextResponse('Internal error...',{status:500})
}
}
 