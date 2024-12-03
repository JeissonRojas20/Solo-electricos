import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const Login = () => {
    const [Correo, setCorreo] = useState('');
    const [Contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const navigate = useNavigate();
    const accountDropdownRef = useRef(null);

    const validarCorreo = (correo) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(correo);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!Correo || !Contrasena) {
            setError('Todos los campos son obligatorios');
            return;
        }

        if (!validarCorreo(Correo)) {
            setError('El correo electrónico no es válido');
            return;
        }

        try {
            const response = await axios.post('https://railway-back-bd-production.up.railway.app/users/validation', {
                Correo,
                Contrasena
            }, { withCredentials: true });

            const usuario = response.data.usuario;
            console.log('Datos del usuario:', usuario);
            sessionStorage.setItem('usuario', JSON.stringify(usuario));

            if (usuario.Usoc === "NoUsada") {
                navigate('/nuevaClave');
            } else {
                switch (usuario.Rol) {
                    case 'Administrador':
                        navigate('/bienvenidaAdministrador');
                        break;
                    case 'Almacenista':
                        navigate('/bienvenidaAlmacenista');
                        break;
                    case 'Cajero':
                        navigate('/bienvenidaCajero');
                        break;
                    case 'Cliente':
                        navigate('/consultaProductoCliente');
                        break;
                    default:
                        navigate('/');
                        break;
                }
            }
        } catch (error) {
            const mensajeError = error.response?.data?.message || 'Error inesperado al iniciar sesión.';
            setError(mensajeError);
            console.error('Error al iniciar sesión:', mensajeError);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target)) {
                setIsAccountDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div>

            <header className="bg-gray-800 py-4 shadow-md w-full">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
                    <Link to="/" className="text-lg font-bold text-gray-100">
                        Solo Electricos
                    </Link>

                    <nav className="flex justify-center space-x-4 mt-4 md:mt-0">
                        <ul className="flex flex-wrap justify-center space-x-4">
                            <li>
                                <Link
                                    to="/"
                                    className="text-gray-100 hover:text-gray-300"
                                >
                                    Inicio
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <div className="flex items-center space-x-6 mt-4 md:mt-0">
                        <div className="relative" ref={accountDropdownRef}>
                            <button
                                onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                                className="flex items-center text-gray-100 hover:text-gray-300 focus:outline-none"
                            >
                                <span>Mi Cuenta</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="currentColor"
                                    className="w-5 h-5 ml-1"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                    />
                                </svg>
                            </button>
                            {isAccountDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                    <Link
                                        to="/registroUsuarioCliente"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Registrarme
                                    </Link>
                                    <Link
                                        to="/login"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Iniciar sesión
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <div className="container mx-auto p-4">
                <main className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto m-4">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar sesión</h2>

                    {error && (
                        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 relative rounded-r-lg shadow-sm">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    {/* Icono de error */}
                                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        ¡Error de acceso!
                                    </h3>
                                    <p className="mt-1 text-sm text-red-700">
                                        {error}
                                    </p>
                                </div>
                                {/* Botón de cerrar */}
                                <button
                                    onClick={() => setError('')}
                                    className="absolute top-4 right-4 text-red-600 hover:text-red-800"
                                >
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="Correo" className="block text-sm font-medium text-gray-700 mb-2">
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                id="Correo"
                                name="Correo"
                                placeholder="Ingresar correo electrónico"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                onChange={(e) => setCorreo(e.target.value)}
                                value={Correo}
                            />
                        </div>
                        <div>
                            <label htmlFor="Contrasena" className="block text-sm font-medium text-gray-700 mb-2">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={mostrarContrasena ? 'text' : 'password'}
                                    id="Contrasena"
                                    name="Contrasena"
                                    placeholder="Ingresar contraseña"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    onChange={(e) => setContrasena(e.target.value)}
                                    value={Contrasena}
                                />
                                <button
                                    type="button"
                                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                >
                                    {mostrarContrasena ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                        >
                            Iniciar sesión
                        </button>
                        <div className="text-center">
                            <div>
                                <Link
                                    to="/enviarCorreo"
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    ¿Olvidó su contraseña?
                                </Link>
                            </div>

                            <div>
                                <Link
                                    to="/registroUsuarioCliente"
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    ¿No tiene una cuenta?
                                </Link>
                            </div>
                        </div>
                    </form>
                </main>
            </div>
        </div>
    );
};

export default Login;