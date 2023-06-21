import bcrypt from 'bcrypt'
import prisma from '../../../libs/prismadb'
import { NextResponse } from 'next/server'

export async function POST(request){
    const body = await request.json();
    const { name, email, password } = body;

    if(!name || !email || !password) {
        return new NextResponse('Todos los campos son obligatorios', { status: 400 })
    }

    if (password.length < 6) {
        return new NextResponse('La contraseña debe tener al menos 6 caracteres', { status: 400 })
    }

    const passwordRegex = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{6,}$/;
    if (!passwordRegex.test(password)) {
        return new NextResponse('La contraseña debe contener números, letras y caracteres especiales', { status: 400 })
    }

    const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z]{2,4})$/;
    if(!emailRegex.test(email)) {
        return new NextResponse('Formato de correo electrónico inválido', { status: 400 })
    }

    const emailDomain = email.split('@')[1];
    const allowedDomains = ['gmail.com', 'outlook.com', 'yahoo.com'];
    if(!allowedDomains.includes(emailDomain)) {
        return new NextResponse('El dominio del correo electrónico no está permitido', { status: 400 })
    }

    const exist = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if(exist) {
        throw new Error('El correo electrónico ya existe')
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            hashedPassword
        }
    });

    return NextResponse.json(user)
}
