import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { users }from "./schema"
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
        const result: any = await this.db.select().from(users);
        console.log("DB'ye bağlantı");
        
       } catch (error) {
        console.log(error);
        throw new Error("Modül Başlatılamadı!");
       } 
    }
}