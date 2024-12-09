import React from 'react'
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb'
import Input from '../../components/Inputs/Input'
import MultiSelect from '../../components/Forms/SelectGroup/MultiSelect'
import Button from '../../components/Button'
import { useNavigate } from 'react-router-dom'

const Configuracion: React.FC = () => {

    const navigate = useNavigate();

    return (
      <>
        <Breadcrumb pageName="Configuración de la evaluación"></Breadcrumb>
        <div className="flex flex-col gap-5 col-span-12 rounded-sm border border-stroke bg-white px-5 pt-7.5 pb-5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-5">
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 justify-between">
              <div className="flex gap-3">
                <Input
                  label="DNI del paciente"
                  disabled
                  value="12345678"
                  classSize="w-35"
                />
                <Input
                  label="Nombre del paciente"
                  disabled
                  value="Paciente 1"
                  classSize="w-80"
                />
                <Input label="Edad" disabled value="3 años" classSize="w-25" />
              </div>
              <div className="flex gap-3 items-end">
                <button
                  onClick={() => navigate('/pacientes')}
                  className="rounded-lg border border-primary px-8 py-2 h-fit dark:text-white text-primary"
                >
                  Cancelar
                </button>
                <a
                  href="http://localhost:8082"
                  target='_blank'
                  className="rounded-lg bg-primary px-10 py-2 h-fit text-white cursor-pointer"
                >
                  Evaluar
                </a>
              </div>
            </div>
            <div className='flex gap-3 flex-col'>
              <h2 className='font-bold text-lg text-boxdark-2 dark:text-slate-200'>Configuración de fonemas</h2>
              <div className="grid grid-cols-2 gap-5">
                <MultiSelect
                  options={[
                    { value: '1', text: 'f', selected: false },
                    { value: '2', text: 'g', selected: false },
                    { value: '3', text: 'ch', selected: false },
                    { value: '4', text: 'x', selected: false },
                    { value: '5', text: 'z', selected: false },
                  ]}
                  label="Nasales"
                  onSelectionChange={(selected) => console.log(selected)}
                />
                <MultiSelect
                  options={[
                    { value: '1', text: 'f', selected: false },
                    { value: '2', text: 'g', selected: false },
                    { value: '3', text: 'ch', selected: false },
                    { value: '4', text: 'x', selected: false },
                  ]}
                  label="Róticas Percusivas"
                  onSelectionChange={(selected) => console.log(selected)}
                />
                <MultiSelect
                  options={[
                    { value: '1', text: 'f', selected: true },
                    { value: '2', text: 'g', selected: false },
                    { value: '3', text: 'ch', selected: false },
                    { value: '4', text: 'x', selected: false },
                    { value: '5', text: 'z', selected: false },
                  ]}
                  label="Oclusivas sordas"
                  onSelectionChange={(selected) => console.log(selected)}
                />
                <MultiSelect
                  options={[
                    { value: '1', text: 'f', selected: false },
                    { value: '2', text: 'g', selected: false },
                    { value: '3', text: 'ch', selected: false },
                    { value: '4', text: 'x', selected: false },
                    { value: '5', text: 'z', selected: false },
                  ]}
                  label="Róticas vibrantes"
                  onSelectionChange={(selected) => console.log(selected)}
                />
                <MultiSelect
                  options={[
                    { value: '1', text: 'f', selected: false },
                    { value: '2', text: 'g', selected: false },
                    { value: '3', text: 'ch', selected: false },
                    { value: '4', text: 'x', selected: false },
                    { value: '5', text: 'z', selected: false },
                  ]}
                  label="Oclusivas sonoras"
                  onSelectionChange={(selected) => console.log(selected)}
                />
                <MultiSelect
                  options={[
                    { value: '1', text: 'f', selected: false },
                    { value: '2', text: 'g', selected: false },
                    { value: '3', text: 'ch', selected: false },
                    { value: '4', text: 'x', selected: false },
                    { value: '5', text: 'z', selected: false },
                  ]}
                  label="Grupos consonánticos laterales"
                  onSelectionChange={(selected) => console.log(selected)}
                />
                <MultiSelect
                  options={[
                    { value: '1', text: 'f', selected: false },
                    { value: '2', text: 'g', selected: false },
                    { value: '3', text: 'ch', selected: false },
                    { value: '4', text: 'x', selected: false },
                    { value: '5', text: 'z', selected: false },
                  ]}
                  label="Laterales"
                  onSelectionChange={(selected) => console.log(selected)}
                />
                <MultiSelect
                  options={[
                    { value: '1', text: 'f', selected: false },
                    { value: '2', text: 'g', selected: false },
                    { value: '3', text: 'ch', selected: false },
                    { value: '4', text: 'x', selected: false },
                    { value: '5', text: 'z', selected: false },
                  ]}
                  label="Grupos consonánticos centrales"
                  onSelectionChange={(selected) => console.log(selected)}
                />
                <MultiSelect
                  options={[
                    { value: '1', text: 'f', selected: false },
                    { value: '2', text: 'g', selected: false },
                    { value: '3', text: 'ch', selected: false },
                    { value: '4', text: 'x', selected: false },
                    { value: '5', text: 'z', selected: false },
                  ]}
                  label="Fricativas"
                  onSelectionChange={(selected) => console.log(selected)}
                />
                <MultiSelect
                  options={[
                    { value: '1', text: 'f', selected: false },
                    { value: '2', text: 'g', selected: false },
                    { value: '3', text: 'ch', selected: false },
                    { value: '4', text: 'x', selected: false },
                    { value: '5', text: 'z', selected: false },
                  ]}
                  label="Vocales"
                  onSelectionChange={(selected) => console.log(selected)}
                />
                <MultiSelect
                  options={[
                    { value: '1', text: 'f', selected: false },
                    { value: '2', text: 'g', selected: false },
                    { value: '3', text: 'ch', selected: false },
                    { value: '4', text: 'x', selected: false },
                    { value: '5', text: 'z', selected: false },
                  ]}
                  label="Africadas"
                  onSelectionChange={(selected) => console.log(selected)}
                />
                <MultiSelect
                  options={[
                    { value: '1', text: 'f', selected: false },
                    { value: '2', text: 'g', selected: false },
                    { value: '3', text: 'ch', selected: false },
                    { value: '4', text: 'x', selected: false },
                    { value: '5', text: 'z', selected: false },
                  ]}
                  label="Diptongos"
                  onSelectionChange={(selected) => console.log(selected)}
                />
              </div>
              <div className="col-span-2"></div>
            </div>
          </div>
        </div>
      </>
    );
}

export default Configuracion