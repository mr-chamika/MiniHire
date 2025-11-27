import { Database } from "@/db";
import { Application } from "@/models/Application";
import { Student } from "@/models/Student";

export async function POST(req: Request) {

    await Database();
    const formData = await req.formData()

    if(formData.has("post_id")){

        const firstName = formData.get("firstName");
        const lastName = formData.get("lastName");
        const university = formData.get("university");
        const degree = formData.get("degree");
        const portfolio = formData.get("portfolio");
        const linkedin = formData.get("linkedin");
        const resume = formData.get("resume");
        const post_id = formData.get("post_id");
        const email = formData.get("email");

        if(!firstName || !lastName || !university || !degree || !portfolio || !linkedin || !resume || !post_id || !email){

            return Response.json({message:'Missing some data to save...'});
            
        }
        
        const student = await Student.findOne({email});
        
        if(student.role != 'student' || student.verified != true ){
            
            return Response.json({message:'Verify Account First...'});
            
        }
        
        const application = await Application.create({
            
            firstName,
            lastName,
            email,
            university,
            degree,
            portfolio,
            linkedin,
            resume,
            post_id
            
        })
        
        if(!application){
            
            return Response.json({message:'Failed to send your application...'});
            
        }
        
        return Response.json({done:'true'});
        
    }
    
}

// export async function GET(req: Request) {

    
// }

// export async function PUT(req: Request) {

    
// }