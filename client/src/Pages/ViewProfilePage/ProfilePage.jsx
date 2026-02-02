import { useUserData } from "../../hooks/useUserData";

const ProfilePage = () => {

    const { data: userData, isLoading, error } = useUserData();

    console.log(userData);

    return (
        <>
        <div>test</div>
        <div>test</div>
        <div>test</div>
        <div>test</div>
        <div>test</div>
        <div>test</div>
        <div>test</div>
        <div>test</div>
        <div>test</div>
        <div>test</div>
        <div>test</div>
        <div>test</div>
        </>
    )
}

export default ProfilePage;