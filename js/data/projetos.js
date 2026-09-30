/** Dados dos projetos. Os status são provisórios: ajuste conforme a realidade da ONG. */
export const projetos = [
  { id: 'hortas', titulo: 'Hortas Comunitárias', categoria: 'alimentar', status: 'ativo',
    descricao: 'Implantação e manutenção de hortas orgânicas em terrenos ociosos, com produção destinada às próprias famílias participantes.',
    metricas: [{ valor: '6', rotulo: 'comunidades' }, { valor: '90', rotulo: 'voluntários' }] },
  { id: 'cesta', titulo: 'Cesta Solidária', categoria: 'alimentar', status: 'ativo',
    descricao: 'Captação e distribuição mensal de cestas básicas para famílias em situação de insegurança alimentar moderada e grave.',
    metricas: [{ valor: '1.200', rotulo: 'famílias/mês' }, { valor: '140', rotulo: 'voluntários' }] },
  { id: 'reforco', titulo: 'Reforço Escolar Comunitário', categoria: 'educacao', status: 'ativo',
    descricao: 'Aulas de reforço em português e matemática para crianças do ensino fundamental, no contraturno escolar.',
    metricas: [{ valor: '410', rotulo: 'crianças' }, { valor: '75', rotulo: 'voluntários' }] },
  { id: 'oficio', titulo: 'Ofício em Movimento', categoria: 'educacao', status: 'andamento',
    descricao: 'Cursos profissionalizantes curtos (costura, informática básica, elétrica predial) para jovens e adultos.',
    metricas: [{ valor: '310', rotulo: 'formados' }, { valor: '28', rotulo: 'instrutores' }] },
  { id: 'roda', titulo: 'Roda de Cuidado', categoria: 'saude', status: 'ativo',
    descricao: 'Grupos de apoio psicossocial e encaminhamento à rede pública de saúde para moradores em situação de vulnerabilidade.',
    metricas: [{ valor: '9', rotulo: 'comunidades' }, { valor: '22', rotulo: 'voluntários' }] },
  { id: 'mutirao', titulo: 'Mutirão de Arborização', categoria: 'ambiental', status: 'concluido',
    descricao: 'Plantio de mudas nativas em áreas urbanas degradadas, em parceria com escolas públicas da região.',
    metricas: [{ valor: '2.100', rotulo: 'mudas plantadas' }, { valor: '60', rotulo: 'voluntários' }] }
];
