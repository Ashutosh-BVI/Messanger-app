import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

const useOtherUser = (conversation: FullConversationType | {
    users: User[]
}) => {
    const session = useSession();

    const othreUser = useMemo(()=>{
        const currentUserEmail= session?.data?.user?.email;

        const otherUser = conversation.user.filter((user:any) => user.email !== currentUserEmail);

        return otherUser[0];
    }, [session?.data?.user?.email, conversation.user]);

    return othreUser;
}


export default useOtherUser;