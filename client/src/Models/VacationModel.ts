class VacationModel {
    public id: number| undefined; ;
    public description: string | undefined;
    public destination: string | undefined;
    public imageName: string | undefined;
    public image: FileList | undefined;
    public fromDate: string | undefined;
    public toDate: string | undefined;
    public price: number | undefined;
    public isFollowed: boolean | undefined;
    public followersCount: number | undefined;
}

export default VacationModel;
