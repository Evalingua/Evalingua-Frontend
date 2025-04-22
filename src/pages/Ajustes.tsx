import React from 'react';
import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import Input from '../components/Inputs/Input';
import { UpdateUsuarioRequest, UsuarioDTO } from '../types/usuario.type';
import Select from '../components/Forms/SelectGroup/Select';
import { UsuarioService } from '../services/usuario/UsuarioService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Ajustes: React.FC = () => {
  const usuarioService = new UsuarioService();
  const { user, isAuthorized } = useAuth();
  const [userValue, setUserValue] = React.useState<UsuarioDTO>({
    username: "",
    nombre: "",
    email: "",
    celular: "",
    estadoRegistro: false,
    rol: ""
  });
  const [constrasenas, setContrasenas] = React.useState({
    nuevaContrasena: "",
    confirmarContrasena: ""
  });
  const [editUser, setEditUser] = React.useState(false);

  const getUser = async () => {
    const response = await usuarioService.getUsuarioByUsername(user?.username || "");
    if (response.status_code === 200) {
      setUserValue({
        username: response.data.username,
        nombre: response.data.nombre,
        email: response.data.email,
        celular: response.data.celular,
        estadoRegistro: response.data.estadoRegistro,
        rol: response.data.rol
      });
    } else {
      toast(response.message, {
        type: "error",
        position: "top-right",
        autoClose: 3000});
    }
  }

  const updateUser = async () => {
    const request: UpdateUsuarioRequest = {
      nombre: userValue.nombre,
      email: userValue.email,
      celular: userValue.celular,
      rol: userValue.rol
    }

    const response = await usuarioService.updateUsuario(userValue.username, request);
    if (response.status_code === 200) {
      toast(response.message, {
        type: "success",
        position: "top-right",
        autoClose: 3000});
      setEditUser(false);
    }
    else {
      toast(response.message, {
        type: "error",
        position: "top-right",
        autoClose: 3000});
    }
  }

  const handleChangePassword = async () => {
    if (constrasenas.nuevaContrasena !== constrasenas.confirmarContrasena) {
      toast("Las contraseñas no coinciden", {
        type: "error",
        position: "top-right",
        autoClose: 3000});
      return;
    }

    const request = {
      username: user?.username || "",
      newPassword: constrasenas.nuevaContrasena
    }

    const response = await usuarioService.changePassword(request);
    if (response.status_code === 200) {
      toast(response.message, {
        type: "success",
        position: "top-right",
        autoClose: 3000});
      setContrasenas({ nuevaContrasena: "", confirmarContrasena: "" });
    }
    else {
      toast(response.message, {
        type: "error",
        position: "top-right",
        autoClose: 3000});
    }
  }

  React.useEffect(() => {
    getUser();
  }, []);

  return (
    <>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Ajustes" back/>

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Información personal
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={updateUser}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/3">
                      <Input
                        label="Nombre de usuario"
                        type="text"
                        placeholder="Nombre de usuario"
                        value={userValue.username}
                        onChange={(e) => setUserValue({ ...userValue, username: e.target.value })}
                        disabled
                      />
                    </div>
                    <div className="w-full sm:w-2/3">
                      <Input
                        label="Nombre y apellido"
                        type="text"
                        placeholder="Nombre y apellido del usuario"
                        value={userValue.nombre}
                        onChange={(e) => setUserValue({ ...userValue, nombre: e.target.value })}
                        disabled={!editUser}
                      />
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <Input 
                        label='Correo electrónico'
                        type='email'
                        placeholder='Correo electrónico del usuario'
                        value={userValue.email}
                        onChange={(e) => setUserValue({ ...userValue, email: e.target.value })}
                        disabled={!editUser}
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <Input
                        label='Celular'
                        type='text'
                        placeholder='Número de celular del usuario'
                        value={userValue.celular}
                        onChange={(e) => setUserValue({ ...userValue, celular: e.target.value })}
                        disabled={!editUser}
                      />
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <Select 
                        label='Rol'
                        placeholder='Seleccione el rol del usuario'
                        options={[
                          { value: 'ADMIN', label: 'Administrador' },
                          { value: 'TERAPEUTA', label: 'Terapeuta' },
                        ]}
                        value={userValue.rol}
                        onChange={(value) => setUserValue({ ...userValue, rol: value })}
                        disabled={!isAuthorized(['ADMIN']) || !editUser}
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <Input
                        label='Estado'
                        type='text'
                        placeholder='Número de celular del usuario'
                        value={userValue.estadoRegistro ? "Activo" : "Inactivo"}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    {editUser ? (
                      <div className="flex gap-2">
                        <button
                          className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                          type="button"
                          onClick={() => setEditUser(false)}
                        >
                          Cancel
                        </button>
                        <button
                        className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                        type="submit"
                        >
                          Guardar
                        </button>
                      </div>
                    ) : (
                      <button
                        className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                        type="button"
                        onClick={() => setEditUser(true)}
                      >
                        Editar
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Actualizar contraseña
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={handleChangePassword}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full">
                      <img src={`https://ui-avatars.com/api/?name=${user?.username}&background=3C50E0&color=fff&size=64&rounded=true`} alt="User" />
                    </div>
                    <div>
                      <span className="mb-1.5 text-black dark:text-white">
                        {user?.username}
                      </span>
                      <span className="flex gap-2.5">
                        <p className="text-sm hover:text-primary">
                          {userValue.email}
                        </p>
                      </span>
                    </div>
                  </div>

                  <div className="mb-5.5 flex-col">
                    <div className="w-full mb-4.5">
                      <Input
                        label='Nueva contraseña'
                        type='password'
                        placeholder='Ingrese su nueva contraseña'
                        value={constrasenas.nuevaContrasena}
                        onChange={(e) => setContrasenas({ ...constrasenas, nuevaContrasena: e.target.value })}
                      />
                    </div>
                    <div className="w-full">
                      <Input
                        label='Confirmar nueva contraseña'
                        type='password'
                        placeholder='Confirme su nueva contraseña'
                        value={constrasenas.confirmarContrasena}
                        onChange={(e) => setContrasenas({ ...constrasenas, confirmarContrasena: e.target.value })}
                      />
                      {
                        constrasenas.nuevaContrasena !== constrasenas.confirmarContrasena && (
                          <small className="text-red-500 text-sm mt-2">
                            Las contraseñas no coinciden
                          </small>
                        )
                      }
                    </div>
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                    >
                      Actualizar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Ajustes;
