import { getCustomRepository, Repository } from "typeorm"
import { User } from "../entities/User";
import { UsersRepository } from "../repositories/UsersRepository"

class UsersService {
    private usersRepository: Repository<User>

    constructor(){
        this.usersRepository = getCustomRepository(UsersRepository);
    }
    async create(email: string) {
        // verificar se usuario existente
        var user = await this.usersRepository.findOne({ email });

        // se nao existir salvar no banco
        if (!user) {
            user = this.usersRepository.create({ email });
            await this.usersRepository.save(user);
        }

        // retornar user
        return user;
    }
}

export { UsersService }