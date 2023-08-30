import getCurrentUser from "@/app/actions/getCurrentUser";
import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

interface IParams {
    conversationId?: string;
}

export async function POST(
    request:Request,
    { params }: { params: IParams }
    ) {
    try{
        const currentUser = await getCurrentUser();

        const {
            conversationId
        } = params;

        if(!currentUser?.id || !currentUser?.email){
            return new NextResponse('Unauthorized', {status: 401});
        }

        // Find the existing conversation
        const conversation = await prisma?.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                messages: {
                    include: {
                        seen: true,
                    }
                },
                user: true
            }
        });

        if(!conversation) {
            return new NextResponse('Invalid Id', { status:400 })
        }

        //Find the last message
        const lastMessage = conversation.messages[conversation.messages.length - 1];

        if(!lastMessage) {
            return NextResponse.json(conversation);
        }

        //update seen of last message
        const updatedMessage = await prisma?.message.update({
            where: {
                id: lastMessage.id
            },
            include: {
                sender: true,
                seen: true
            },
            data:{
                seen: {
                   connect: {
                        id: currentUser.id
                    }
                }
            }
        });

         // Update all connections with new seen
    await pusherServer.trigger(currentUser.email, 'conversation:update', {
        id: conversationId,
        messages: [updatedMessage]
      });
  
      // If user has already seen the message, no need to go further
      if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
        return NextResponse.json(conversation);
      }
  
      // Update last message seen
      await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);
        
        return NextResponse.json(updatedMessage);

    }catch(err:any){
        console.log(err,"Err messages seeen");
        return new NextResponse("Internal Error", { status:500 });
    }
}