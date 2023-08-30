import { config } from 'dotenv';
config();

import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
    appId: "1660103"!,
    key: "45363d869f315b2d54cc"!,
    secret: "1348ae8a44c8664ed60a"!,
    cluster:'ap2',
    useTLS: true
});

export const pusherClient  = new PusherClient("45363d869f315b2d54cc",
    {
        channelAuthorization: {
            endpoint: '/api/pusher/auth',
            transport: 'ajax',
          },
        cluster:'ap2'
    }
) 