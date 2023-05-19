import Button from "@mui/material/Button"
import Link from "next/link"

export const Forbidden = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-cyan-300 ">
            <h1 className="text-7xl mb-10">Forbidden</h1>
            <h2 className="text-3xl">You are not authorised to view this page</h2>
            <Button variant="contained" className="bg-red-300 mt-20 rounded-xl">
                <Link className="text-2xl" href={'/'}>Go Home</Link>
            </Button>
        </div>
    )
}