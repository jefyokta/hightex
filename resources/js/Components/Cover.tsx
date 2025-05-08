
import LogoUin from './../../img/logo-uin.png'

type CoverProps = {
    title: string,
    name: string,

}
export const Cover: React.FC<CoverProps> = ({ title, name }) => {
    return <div>
        <h1 className="title">{title}</h1>
        <div>
            <p>Oleh :</p>
        </div>
        <div>
            {name}
        </div>
        <img src={LogoUin} alt="logo-uin" />
        <div className='text-center font-bolf'>
            <div>Program Studi Sistem Informasi</div>
            <div>FAKULTAS SAINS DAN TEKNOLOGI</div>
            <div>UNIVERSITAS ISLAM NEGERI SULTAN SYARIF KASIM RIAU</div>
            <div>PEKANBARU</div>
            <div>{new Date().getFullYear()}</div>
        </div>
    </div>
}
