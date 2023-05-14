import Button from "@mui/material/Button"
import Link from "next/link"

export const Forbidden = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-cyan-300 ">
            <h1 className="text-7xl mb-10">Forbidden</h1>
            <h2 className="text-3xl">You are not authorised to view this page</h2>
            <Button className="bg-blue-200 mt-10">
                <Link className="text-5xl" href={'/'}>Go Home</Link>
            </Button>
        </div>
    )
}