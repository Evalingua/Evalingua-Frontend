import React from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import Select from "../../components/Forms/SelectGroup/Select";
import Input from "../../components/Inputs/Input";
import Table from "../../components/Tables/Table";
import { ListUsuarioRequest, NewUsuarioRequest } from "../../types/usuario.type";
import { UsuarioService } from "../../services/usuario/UsuarioService";
import { toast } from "react-toastify";
import Button from "../../components/Button";
import Modal from "../../components/Modal";

const Perfiles: React.FC = () => {
    const usuarioService = new UsuarioService();
    const [search, setSearch] = React.useState<string>('');
    const [selectedOption, setSelectedOption] = React.useState<string>('nombre');
    const [selectedEstado, setSelectedEstado] = React.useState<string>('TODOS');
    const [usuariosList, setUsuariosList] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [paginationProps, setPaginationProps] = React.useState({
        currentPage: 1,
        pageSize: 10,
        totalPages: 0,
        totalItems: 0,
        onPageChange: (page: number) => handlePagination(page),
    });
    const [selectedRol, setSelectedRol] = React.useState<string>('TODOS');
    const [showModal, setShowModal] = React.useState({
        activate: false,
        delete: false,
        new: false
    });
    const [usuario, setUsuario] = React.useState({
        username: '',
        nombre: '',
        apellidos: '',
        email: '',
        celular: '',
        rol: 'TERAPEUTA'
    });

    const optionsSearch = [
        { value: 'username', label: 'Usuario' },
        { value: 'nombre', label: 'Nombres' },
    ]
    const optionsEstado = [
        { value: 'TODOS', label: 'Todos' },
        { value: 'ACTIVO', label: 'Activo' },
        { value: 'INACTIVO', label: 'Inactivo' },
    ]
    const optionsRol = [
        { value: 'TODOS', label: 'Todos' },
        { value: 'ADMIN', label: 'Administrador' },
        { value: 'TERAPEUTA', label: 'Terapeuta' },
    ]

    const columns = [
        { title: 'Nombre de usuario', key: 'username' },
        { title: 'Nombre y apellido', key: 'nombre' },
        { title: 'Email', key: 'email' },
        { title: 'Nro Celular', key: 'celular' },
        { title: 'Rol', key: 'rol' },
        { title: 'Estado', key: 'estadoRegistro',
            render: (item: any) => (
                <span className={`text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-full ${item.estadoRegistro ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                    {item.estadoRegistro ? 'Activo' : 'Inactivo'}
                </span>
            )
         },
    ]

    const actions = [
        {
            label: 'Delete',
            onClick: (item: any) => {
                if (item.estadoRegistro) {
                    setUsuario({ ...usuario, username: item.username });
                    setShowModal({ ...showModal, delete: true });
                }
                else {
                    toast('Solo se puede desactivar un usuario activo', {
                        type: 'warning',
                        position: 'top-right',
                        autoClose: 2000,
                        hideProgressBar: false
                    });
                }
            }
        },
        {
            label: 'Activate',
            onClick: (item: any) => {
                if (!item.estadoRegistro) {
                    setUsuario({ ...usuario, username: item.username });
                    setShowModal({ ...showModal, activate: true });
                }
                else {
                    toast('Solo se puede reactivar un usuario inactivo', {
                        type: 'warning',
                        position: 'top-right',
                        autoClose: 2000,
                        hideProgressBar: false
                    });
                }
            }
        }
    ]

    const ListUsuarios = async () => {
        setLoading(true);
        try {
            const request: ListUsuarioRequest = {
                page: paginationProps.currentPage - 1,
                size: paginationProps.pageSize,
                username: selectedOption === 'username' ? search : undefined,
                nombre: selectedOption === 'nombre' ? search : undefined,
                estadoRegistro: selectedEstado === 'TODOS' ? undefined : selectedEstado === 'ACTIVO' ? true : false,
                rol: selectedRol === 'TODOS' ? undefined : selectedRol,
            }
            const response = await usuarioService.getUsuarios(request);
            if (response.status_code === 200) {
                setUsuariosList(response.data.content);
                setPaginationProps(prevProps => ({
                    ...prevProps,
                    totalPages: response.data.totalPages,
                    totalItems: response.data.totalElements,
                }));
                setLoading(false);
            } else {
                toast(response.message, {
                    type: 'error',
                    position: 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false
                });
            }
        } catch (error) {
            toast('Error fetching usuarios', {type: 'error', position: 'top-right', autoClose: 2000, hideProgressBar: false});
        }
    }

    const createUsuario = () => {
        const request: NewUsuarioRequest = {
            username: usuario.username,
            password: usuario.username,
            nombre: usuario.nombre + ' ' + usuario.apellidos,
            email: usuario.email,
            celular: usuario.celular,
            rol: usuario.rol,
        }
        usuarioService.createUsuario(request).then((response) => {
            if (response.status_code === 200) {
                toast(response.message, {type: 'success', position: 'top-right', autoClose: 2000, hideProgressBar: false});
                setShowModal({ ...showModal, new: false });
                setUsuario({
                    username: '',
                    nombre: '',
                    apellidos: '',
                    email: '',
                    celular: '',
                    rol: 'TERAPEUTA'
                });
                ListUsuarios();
            } else {
                toast(response.message, {type: 'error', position: 'top-right', autoClose: 2000, hideProgressBar: false});
            }            
        }).catch((error) => {
            console.error('Error creating usuario:', error);
        });
    }

    const handleDelete = (username: string) => {
        usuarioService.anularUsuario(username).then((response) => {
            if (response.status_code === 200) {
                toast(response.message, {type: 'success', position: 'top-right', autoClose: 2000, hideProgressBar: false});
                setShowModal({ ...showModal, delete: false });
                ListUsuarios();
            } else {
                toast(response.message, {type: 'error', position: 'top-right', autoClose: 2000, hideProgressBar: false});
            }
        }).catch(() => {
            toast('Error deleting usuario', {type: 'error', position: 'top-right', autoClose: 2000, hideProgressBar: false});
        });
    }

    const handleActivar = (username: string) => {
        usuarioService.activarUsuario(username).then((response) => {
            if (response.status_code === 200) {
                toast(response.message, {type: 'success', position: 'top-right', autoClose: 2000, hideProgressBar: false});
                setShowModal({ ...showModal, activate: false });
                ListUsuarios();
            } else {
                toast(response.message, {type: 'error', position: 'top-right', autoClose: 2000, hideProgressBar: false});
            }
        }).catch(() => {
            toast('Error activating usuario', {type: 'error', position: 'top-right', autoClose: 2000, hideProgressBar: false});
        });
    }

    const handlePagination = (page: number) => {
        setPaginationProps(prevProps => ({ ...prevProps, currentPage: page }));
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        ListUsuarios();
    }

    React.useEffect(() => {
        ListUsuarios();
    }, [paginationProps.currentPage, selectedEstado, selectedRol]);

    React.useEffect(() => {
        const nombre = usuario.nombre.split(' ');
        const apellidos = usuario.apellidos.split(' ');
        const usernameFinal = `${nombre[0][0]}${apellidos[0]}`;
        setUsuario({...usuario, username: usernameFinal });
    }, [usuario.nombre, usuario.apellidos]);

    return (
        <>
            <Breadcrumb pageName="Perfiles" />
            <div className="flex flex-col gap-5 col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
                <div className="flex items-end justify-between">
                    <div className="flex gap-3 items-end">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <Select
                                placeholder="Buscar por"
                                options={optionsSearch}
                                value={selectedOption}
                                className="w-28"
                                onChange={(value) => setSelectedOption(value)}
                            />
                            <Input
                                placeholder="Buscar"
                                isSearch
                                value={search}
                                type={selectedOption === 'dni' ? 'number' : 'text'}
                                onChange={(e) => setSearch(e.target.value)}
                                onSearchClick={handleSubmit}
                            />
                        </form>
                        <Select
                            label="Estado"
                            placeholder="Seleccionar"
                            options={optionsEstado}
                            value={selectedEstado}
                            className="w-28"
                            onChange={(value) => setSelectedEstado(value)}
                        />
                        <Select
                            label="Rol"
                            placeholder="Seleccionar"
                            options={optionsRol}
                            value={selectedRol}
                            className="w-36"
                            onChange={(value) => setSelectedRol(value)}
                        />
                    </div>
                    <div>
                        <Button
                            text="Nuevo usuario"
                            onClick={() => setShowModal({ ...showModal, new: true })}
                            backgroundColor="#3C50E0"
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="20" height="20" fill="none"/><path fill="currentColor" d="M11 9h4v2h-4v4H9v-4H5V9h4V5h2zm-1 11a10 10 0 1 1 0-20a10 10 0 0 1 0 20m0-2a8 8 0 1 0 0-16a8 8 0 0 0 0 16"/></svg>
                            }
                        />
                    </div>
                    <Modal
                        isOpen={showModal.new}
                        onClose={() => setShowModal({ ...showModal, new: false })}
                        closeOnClickOutside={false}
                        title="Nuevo usuario"
                        size="lg"
                        footer={
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowModal({ ...showModal, new: false })}
                                    className="rounded-lg border border-primary px-6 py-2 dark:text-white text-primary"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => createUsuario()}
                                    disabled={!usuario.username || !usuario.nombre || !usuario.email || !usuario.celular}
                                    type="submit"
                                    className="rounded-lg bg-primary px-6 py-2 text-white disabled:bg-primary/50 disabled:cursor-not-allowed"
                                >
                                    Guardar
                                </button>
                            </div>
                        }
                    >
                        <form onSubmit={createUsuario} className="grid grid-cols-2 gap-5">
                            <Input
                                label="Nombres"
                                placeholder="Ingrese nombres"
                                type="text"
                                value={usuario.nombre}
                                onChange={(e) => {
                                    setUsuario({ 
                                        ...usuario,
                                        nombre: e.target.value 
                                    });
                                }}
                            />
                            <Input
                                label="Apellidos"
                                placeholder="Ingrese apellidos"
                                type="text"
                                value={usuario.apellidos}
                                onChange={(e) => {
                                    setUsuario({ 
                                        ...usuario,
                                        apellidos: e.target.value 
                                    });
                                }}
                            />
                            <Input
                                label="Nombre de usuario"
                                placeholder="Nombre de usuario"
                                type="text"
                                value={usuario.username}
                                disabled
                            />
                            <Input
                                label="Email"
                                placeholder="Email"
                                type="email"
                                value={usuario.email}
                                onChange={(e) => setUsuario({ ...usuario, email: e.target.value })}
                            />
                            <Input
                                label="Nro celular"
                                placeholder="Nro celular"
                                type="number"
                                value={usuario.celular}
                                onChange={(e) => setUsuario({ ...usuario, celular: e.target.value })}
                            />
                            <Select
                                label="Rol"
                                placeholder="Seleccionar rol"
                                value={usuario.rol}
                                options={optionsRol.filter(option => option.value !== 'TODOS')}
                                onChange={(value) => setUsuario({ ...usuario, rol: value })}
                            />
                        </form>
                    </Modal>
                    <Modal
                        isOpen={showModal.delete}
                        onClose={() => setShowModal({ ...showModal, delete: false })}
                        closeOnClickOutside={false}
                        title="Desactivar usuario"
                        size="sm"
                        footer={
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowModal({ ...showModal, delete: false })}
                                    className="rounded-lg border border-primary px-6 py-2 dark:text-white text-primary"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => handleDelete(usuario.username)}
                                    className="rounded-lg bg-danger px-6 py-2 text-white"
                                >
                                    Desactivar
                                </button>
                            </div>
                        }
                    >
                        <div className="flex flex-col gap-3">
                            <p>¿Estas seguro que deseas desactivar este usuario?</p>
                            <p className="text-danger">Este usuario no podrá acceder al sistema</p>
                        </div>
                    </Modal>
                    <Modal
                        isOpen={showModal.activate}
                        onClose={() => setShowModal({ ...showModal, activate: false })}
                        closeOnClickOutside={false}
                        title="Reactivar usuario"
                        size="sm"
                        footer={
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowModal({ ...showModal, activate: false })}
                                    className="rounded-lg border border-primary px-6 py-2 dark:text-white text-primary"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => handleActivar(usuario.username)}
                                    className="rounded-lg bg-danger px-6 py-2 text-white"
                                >
                                    Reactivar
                                </button>
                            </div>
                        }
                    >
                        <div className="flex flex-col gap-3">
                            <p>¿Estas seguro que deseas reactivar este usuario?</p>
                            <p className="text-success">Este usuario recuperará el acceso al sistema</p>
                        </div>
                    </Modal>
                </div>
                <Table
                    columns={columns}
                    data={usuariosList}
                    actions={actions}
                    paginationEnabled
                    paginationProps={paginationProps}
                    loading={loading}
                />
            </div>
        </>
    );
}

export default Perfiles;