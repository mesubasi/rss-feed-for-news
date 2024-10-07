import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { rss, bodyUrl }from "./schema"
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
        // const result: any = await this.db.select().from(rss);
        console.log("DB'ye bağlantı");
        
       } catch (error) {
        console.log(error);
        throw new Error("Modül Başlatılamadı!");
       } 
    }

    async addRss(name: string, url: string){
        try {
            await this.db.insert(rss).values({
                name,
                url,
            })
        } catch (err) {
            console.log(err);
        }
    }
}