import Button from "@mui/material/Button"
import Link from "next/link"

export const Forbidden = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#D9C9B1] ">
            <div className="w-2/3 h-2/3 lg:w-1/2 mx-auto bg-[#F68888] shadow-lg rounded px-8 py-12 justify-center">
                <h1 className="text-7xl mb-10 text-center">Forbidden</h1>
                <h2 className="text-3xl text-center">You are not authorised to view this page</h2>
                <Button className="bg-[#EDC3AB] mt-10 ml-52 hover:bg-[#EFAE89]">
                    <Link className="text-5xl text-black text-center" href={'/'}>Go Home</Link>
                </Button>
            </div>
        </div>
    )
}