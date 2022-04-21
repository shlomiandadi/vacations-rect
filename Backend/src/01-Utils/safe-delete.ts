import fs from 'fs';

function safeDelete(absolutePath: string): void {

    try {

        if(!absolutePath) return;

        // Only if file exists in disk - try to delete it:
        if(fs.existsSync(absolutePath)) {
            fs.unlinkSync(absolutePath); 
        }

    }
    catch(err: any) { 
        console.error(err);
    }

}

export default safeDelete;