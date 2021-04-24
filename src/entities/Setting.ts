import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from "typeorm"

import { v4 as uuid } from "uuid" // v4 : garador de uuid com numeros aleatórios

@Entity("settings")
class Setting {
    @PrimaryColumn()
    id: string;

    @Column()
    username: string;

    @Column()
    chat: boolean;

    @CreateDateColumn()
    updated_at: Date;

    @UpdateDateColumn()
    created_at: Date;

    constructor (){
        if(!this.id) this.id = uuid(); // verificação para garantir que quando estiver atuailzando nao sobrescreva o uuid
    }
}

export { Setting }