"use client";
import { Input } from "@heroui/react"
export default function FormAutenticarse() {
    return <div className="w-full">
        <Input
            className="max-w-xs"
            label="Email"
            type="email"
            variant="bordered"
        />
        <Input
            className="max-w-xs"
            label="Password"
            type="password"
            variant="bordered"
        />
    </div>
}