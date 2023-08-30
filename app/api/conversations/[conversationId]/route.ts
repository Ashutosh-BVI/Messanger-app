import { NextResponse } from "next/server";
import prisma from '@/app/libs/prismadb';
import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
    conversationId?:string;
}

export async function DELETE (
    request : ReadonlyReducerState,
    { params }: { params: IParams }
) {
    try {
        const { conversationId } = params;
        const currentUser = await getCurrentUser();

        if(!currentUser?.id) {
            return new NextResponse('Unauthorized', { status:401 });
        }

        const existingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                user: true
            }
        });

        if(!existingConversation) {
            return new NextResponse('Invalid ID', { status: 400 });
        }

        const deleteConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            }
        });


        existingConversation.user.forEach((user) => {
            if (user.email) {
            pusherServer.trigger(user.email, 'conversation:remove', existingConversation);
            }
        });

        return NextResponse.json(deleteConversation)
         
    }catch (err: any){
        console.log(err, 'Error in conversation delete');
        return new NextResponse("Internam Error", { status: 500 });
    }
}