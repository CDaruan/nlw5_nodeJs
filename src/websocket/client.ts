import { io } from "../http";
import { ConnectionsService } from "../services/ConnectionService";
import { MessagesService } from "../services/MessageService";
import { UsersService } from "../services/UserService";

interface IParams {
    text: string;
    email: string;
}

io.on("connect", (socket) => {
    const connectionsService = new ConnectionsService();
    const usersService = new UsersService();
    const messagesService = new MessagesService();

    socket.on("client_first_access", async (params: IParams) => {
        const socket_id = socket.id;
        const { text, email } = params;


        const user = await usersService.create(email);
        const connection = await connectionsService.findByUserId(user.id);

        if (!connection)
            // Salvar conexão com socket_id, user_id
            await connectionsService.create({
                socket_id,
                user_id: user.id,
            })

        else {
            connection.socket_id = socket_id;
            await connectionsService.create(connection)
        }

        await messagesService.create({
            user_id: user.id, text
        });
        const allMessages = await messagesService.listByUser(user.id);

        socket.emit("client_list_all_messages", allMessages);
    })
    socket.on("client_send_to_admin", async (params) => {
        const { text, socket_admin_id } = params;
        console.log("client_send_to_admin" + socket_admin_id)

        const socket_id = socket.id;

        const { user_id } = await connectionsService.findBySocketId(socket_id)

        const message = await messagesService.create({
            text,
            user_id
        })
        io.to(socket_admin_id).emit("admin_receive_message", {
            message,
            socket_id
        })
    })
});