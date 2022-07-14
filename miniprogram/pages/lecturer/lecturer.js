Page({
    data: {
        lecturerName:'',
        lecturerOrg:'',
        lecturerSex:'',
        lecturerIntroduction:'',
        lecturerLove:'',
        lecturerPicture:'',
        lecturerHead:'',
        lecturerNumber:0,
    },

    onLoad(options){
        var teacher = JSON.parse(options.teacher);
        var sex = '';
        if(teacher.lecturerSex=='男'){
            sex='../../images/male.png'
        }
        else{
            sex='../../images/female.png'
        }
        this.setData({
            lecturerName:teacher.lecturerName,
            lecturerOrg:teacher.lecturerOrg,
            lecturerSex:sex,
            lecturerIntroduction:teacher.lecturerIntroduction,
            lecturerLove:teacher.lecturerLove,
            lecturerPicture:'http://1.15.78.63/dev-api'+teacher.lecturerPicture,
            lecturerHead:'http://1.15.78.63/dev-api'+teacher.lecturerHead,
            lecturerNumber:teacher.lecturerNumber,
        })
    }
})