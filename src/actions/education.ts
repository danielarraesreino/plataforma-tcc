'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function getEducationalContent(category?: string, type?: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    const where: any = {};
    if (category) where.category = category;
    if (type) where.contentType = type;

    const contents = await prisma.educationalContent.findMany({
      where,
      orderBy: [{ category: 'asc' }, { createdAt: 'desc' }],
    });

    return { data: contents };
  } catch (error) {
    console.error('Erro ao buscar conteúdo educacional:', error);
    return { error: 'Erro ao carregar conteúdo' };
  }
}

export async function getContentById(id: string) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { error: 'Usuário não autenticado' };
    }

    const content = await prisma.educationalContent.findUnique({
      where: { id },
    });

    return { data: content };
  } catch (error) {
    console.error('Erro ao buscar conteúdo:', error);
    return { error: 'Erro ao carregar conteúdo' };
  }
}

// Seed function to populate initial educational content
export async function seedEducationalContent() {
  try {
    const contents = [
      // Anxiety articles
      {
        title: 'Entendendo a Ansiedade',
        category: 'Ansiedade',
        contentType: 'article' as const,
        content: `A ansiedade é uma resposta natural do nosso corpo ao estresse. Ela se torna um problema quando é excessiva ou persistente.

**Sintomas comuns:**
- Preocupação excessiva
- Inquietação
- Fadiga
- Dificuldade de concentração
- Irritabilidade
- Tensão muscular
- Problemas para dormir

**Técnicas de enfrentamento:**
1. Respiração profunda
2. Mindfulness e meditação
3. Exercício físico regular
4. Limitar cafeína e álcool
5. Manter uma rotina de sono saudável

Lembre-se: buscar ajuda profissional é fundamental quando a ansiedade interfere na sua qualidade de vida.`,
        durationMin: 5,
      },
      {
        title: 'Técnica de Respiração 4-7-8',
        category: 'Ansiedade',
        contentType: 'exercise' as const,
        content: `Esta técnica de respiração é poderosa para reduzir a ansiedade e promover o relaxamento.

**Como fazer:**

1. Sente-se ou deite-se em uma posição confortável
2. Coloque a ponta da língua atrás dos dentes da frente superiores
3. Expire completamente pela boca, fazendo um som de "whoosh"
4. Feche a boca e inspire pelo nariz contando até 4
5. Segure a respiração contando até 7
6. Expire completamente pela boca contando até 8, fazendo o som de "whoosh"
7. Repita o ciclo 3-4 vezes

**Dicas:**
- Pratique 2 vezes ao dia
- Não se preocupe se não conseguir os tempos exatos no início
- O importante é a proporção 4:7:8`,
        durationMin: 3,
      },
      // Depression articles
      {
        title: 'Compreendendo a Depressão',
        category: 'Depressão',
        contentType: 'article' as const,
        content: `A depressão é um transtorno de humor que afeta como você se sente, pensa e funciona.

**Sintomas principais:**
- Humor deprimido na maior parte do dia
- Perda de interesse ou prazer nas atividades
- Alterações no apetite ou peso
- Distúrbios do sono
- Fadiga ou perda de energia
- Sentimentos de inutilidade ou culpa
- Dificuldade de concentração
- Pensamentos sobre morte ou suicídio

**Tratamentos eficazes:**
- Psicoterapia (especialmente TCC)
- Medicamentos antidepressivos
- Exercício físico
- Exposição à luz solar
- Conexões sociais

A depressão tem tratamento. Buscar ajuda é o primeiro passo.`,
        durationMin: 6,
      },
      // CBT articles
      {
        title: 'O Que é Terapia Cognitivo-Comportamental?',
        category: 'TCC',
        contentType: 'article' as const,
        content: `A Terapia Cognitivo-Comportamental (TCC) é uma abordagem psicoterapêutica baseada em evidências.

**Princípios fundamentais:**

1. **Nossos pensamentos influenciam nossos sentimentos e comportamentos**
   - Não são os eventos que nos afetam, mas como os interpretamos

2. **Podemos identificar e modificar padrões de pensamento negativos**
   - Distorções cognitivas podem ser reconhecidas e desafiadas

3. **Mudanças no comportamento podem melhorar o humor**
   - Ativação comportamental é uma técnica poderosa

**Técnicas comuns da TCC:**
- Reestruturação cognitiva
- Registro de pensamentos disfuncionais
- Experimentos comportamentais
- Exposição gradual
- Treinamento de habilidades sociais

A TCC é eficaz para diversos transtornos: ansiedade, depressão, TOC, fobias, e mais.`,
        durationMin: 7,
      },
      {
        title: 'Identificando Distorções Cognitivas',
        category: 'TCC',
        contentType: 'article' as const,
        content: `Distorções cognitivas são padrões de pensamento irracionais que contribuem para emoções negativas.

**Principais distorções:**

1. **Pensamento tudo-ou-nada**
   - Ver situações em categorias extremas ("se não for perfeito, é um fracasso")

2. **Generalização excessiva**
   - Tirar conclusões amplas de um único evento ("sempre dá errado")

3. **Filtro mental**
   - Focar apenas nos aspectos negativos

4. **Desqualificar o positivo**
   - Ignorar experiências positivas

5. **Leitura mental**
   - Achar que sabe o que outros estão pensando

6. **Previsão do futuro**
   - Antecipar que as coisas darão errado

7. **Catastrofização**
   - Esperar o pior cenário possível

8. **Raciocínio emocional**
   - "Se sinto que sou inútil, devo ser"

9. **Deveria/deveria não**
   - Regras rígidas sobre como as coisas devem ser

10. **Personalização**
    - Se culpar por eventos fora do seu controle

Reconhecer essas distorções é o primeiro passo para modificá-las.`,
        durationMin: 8,
      },
      // Mindfulness
      {
        title: 'Introdução ao Mindfulness',
        category: 'Mindfulness',
        contentType: 'article' as const,
        content: `Mindfulness (atenção plena) é a prática de estar presente no momento, sem julgamento.

**Benefícios comprovados:**
- Redução do estresse e ansiedade
- Melhora da concentração
- Regulação emocional
- Melhor qualidade de sono
- Aumento do bem-estar geral

**Como começar:**

1. **Respiração consciente**
   - Dedique 5 minutos para observar sua respiração

2. **Body scan**
   - Percorra mentalmente cada parte do corpo

3. **Observação sem julgamento**
   - Note pensamentos e emoções sem se apegar a eles

4. **Atividade cotidiana mindful**
   - Faça uma tarefa diária com total atenção

**Dica:** Comece com 5 minutos por dia e aumente gradualmente. A consistência é mais importante que a duração.`,
        durationMin: 5,
      },
      {
        title: 'Meditação Guiada de 5 Minutos',
        category: 'Mindfulness',
        contentType: 'exercise' as const,
        content: `Uma meditação rápida para acalmar a mente e o corpo.

**Instruções:**

1. Encontre uma posição confortável, sentado ou deitado
2. Feche os olhos ou mantenha-os suavemente focados
3. Traga atenção para sua respiração natural
4. Observe o ar entrando e saindo das narinas
5. Quando a mente divagar (e vai), gentilmente traga de volta à respiração
6. Note sensações no corpo sem tentar mudá-las
7. Ouça sons ao redor sem julgá-los
8. Nos últimos minutos, expanda a atenção para todo o corpo
9. Movimente suavemente dedos das mãos e pés
10. Abra os olhos quando se sentir pronto

Lembre-se: não há maneira "errada" de meditar. Cada sessão é única.`,
        durationMin: 5,
      },
      // Stress management
      {
        title: 'Gerenciamento do Estresse',
        category: 'Estresse',
        contentType: 'article' as const,
        content: `O estresse é uma resposta natural, mas o estresse crônico pode prejudicar a saúde.

**Sinais de estresse excessivo:**
- Dores de cabeça frequentes
- Tensão muscular
- Fadiga constante
- Irritabilidade
- Dificuldade de concentração
- Alterações no sono
- Mudanças no apetite

**Estratégias de gerenciamento:**

1. **Identifique os gatilhos**
   - Mantenha um diário de estresse

2. **Estabeleça limites**
   - Aprenda a dizer "não"

3. **Pratique autocuidado**
   - Sono adequado, alimentação balanceada, exercício

4. **Técnicas de relaxamento**
   - Respiração, meditação, yoga

5. **Conexão social**
   - Mantenha relacionamentos saudáveis

6. **Organize seu tempo**
   - Priorize tarefas e delegue quando possível

7. **Busque apoio profissional**
   - Terapia pode ajudar a desenvolver estratégias`,
        durationMin: 6,
      },
    ];

    for (const content of contents) {
      const existing = await prisma.educationalContent.findFirst({
        where: { title: content.title },
      });
      if (!existing) {
        await prisma.educationalContent.create({
          data: content,
        });
      }
    }

    return { success: true, count: contents.length };
  } catch (error) {
    console.error('Erro ao popular conteúdo:', error);
    return { error: 'Erro ao popular conteúdo educacional' };
  }
}
