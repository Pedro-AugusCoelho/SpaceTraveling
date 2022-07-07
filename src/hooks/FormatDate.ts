import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

export const FormatDate = (PublicationDate:string) => {
    return format(
        new Date(PublicationDate),
        "dd MMM yyyy",
        {
            locale: ptBR,
        }
    )

}

