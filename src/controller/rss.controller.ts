import { Controller, Get } from '@nestjs/common';

@Controller('feed')
export class ControllerController {
    @Get()
    async rssFeed(){
        try {
            
        } catch (error) {
            console.log(error);
            throw new Error("RSS de bir problem oluştu");
        }
    }
}
