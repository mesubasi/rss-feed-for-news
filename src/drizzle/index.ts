import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client, Pool } from "pg";
import { OnModuleInit } from "@nestjs/common";

export class Index implements OnModuleInit{
    private pool: Pool;
    db: any;

    constructor(){
        this.pool = new Pool({
            connectionString: process.env.DB_URI,
          });
          
        this.db = drizzle(this.pool);
    }

    async onModuleInit() {
       try {
        const result: any = await this.db.select().from();
       } catch (error) {
        console.log(error);
        throw new Error("Modül Başlatılamadı!");
       } 
    }
}