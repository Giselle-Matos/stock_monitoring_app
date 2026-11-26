import { useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View, StyleSheet } from 'react-native';
import { buscarCotacoes, type Cotacao } from './services/brapi';
import { auth } from './services/firebase';
import { signOut } from 'firebase/auth';

const acoesIniciais = ['PETR4', 'VALE3', 'ITUB4'];
const moeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});


export function HomeScreen({ onLogout, onSettingScreen }: { onLogout: () => void, onSettingScreen: () => void }) {
  const [acoes, setAcoes] = useState(acoesIniciais);
  const [cotacoes, setCotacoes] = useState<Record<string, Cotacao>>({});
  const [mostrarBusca, setMostrarBusca] = useState(false);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');


  async function consultar(tickers: string[]) {
    setCarregando(true);
    setErro('');

    try {
      const resultado = await buscarCotacoes(tickers);

      setCotacoes((anteriores) => {
        const atualizadas = { ...anteriores };

        for (const cotacao of resultado) {
          atualizadas[cotacao.symbol] = cotacao;
        }

        return atualizadas;
      });

      return resultado;
    } catch (erroDaConsulta) {
      setErro(
        erroDaConsulta instanceof Error
          ? erroDaConsulta.message
          : 'Falha ao consultar as cotações.',
      );
      return [];
    } finally {
      setCarregando(false);
    }
  }

  async function adicionarAcao() {
    const ticker = busca.trim().toUpperCase();

    if (!/^[A-Z]{4}\d{1,2}$/.test(ticker)) {
      setErro('Digite um ticker como MGLU3.');
      return;
    }

    if (acoes.includes(ticker)) {
      setErro(`${ticker} já está na lista.`);
      return;
    }

    const [cotacao] = await consultar([ticker]);

    if (cotacao) {
      setAcoes((lista) =>
        lista.includes(cotacao.symbol) ? lista : [...lista, cotacao.symbol],
      );
      setBusca('');
      setMostrarBusca(false);
    }
  }

  async function sair() {
    setMensagemErro('');

    try{
        await signOut(auth);
        onLogout();    
    }
    catch (erro){
        let mensagem = 'Falha ao fazer logout. Tente novamente';
        setMensagemErro(mensagem);
    }
  }

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.titulo}>Cotações B3</Text>

      <View style={styles.tabela}>
        <View style={[styles.linha, styles.cabecalho]}>
          <Text style={[styles.celula, styles.rotulo]}>Ação</Text>
          <Text style={[styles.celula, styles.rotulo]}>Preço</Text>
          <Text style={[styles.celula, styles.rotulo]}>Variação</Text>
        </View>

        {acoes.map((ticker) => {
          const dados = cotacoes[ticker]?.data;
          const variacao = dados?.regularMarketChangePercent;
          const percentual = variacao === undefined
            ? '—'
            : `${variacao > 0 ? '+' : ''}${variacao.toLocaleString('pt-BR', {
                maximumFractionDigits: 2,
              })}%`;

          return (
            <View key={ticker} style={[styles.linha, styles.divisoria]}>
              <View style={styles.celula}>
                <Text style={styles.rotulo}>{ticker}</Text>
                {dados?.longName && (
                  <Text style={styles.nome} numberOfLines={2}>{dados.longName}</Text>
                )}
              </View>
              <Text style={styles.celula}>
                {dados ? moeda.format(dados.regularMarketPrice) : '—'}
              </Text>
              <Text style={[
                styles.celula,
                variacao !== undefined && variacao > 0 && styles.alta,
                variacao !== undefined && variacao < 0 && styles.queda,
              ]}>
                {percentual}
              </Text>
            </View>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => consultar(acoes)}
        disabled={carregando}
        style={({ pressed }) => [styles.botao, (pressed || carregando) && styles.apagado]}
      >
        <Text style={styles.textoPrincipal}>
          {carregando ? 'Consultando...' : 'Consultar cotações'}
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: mostrarBusca }}
        onPress={() => setMostrarBusca(!mostrarBusca)}
        style={({ pressed }) => [styles.botao, styles.secundario, pressed && styles.apagado]}
      >
        <Text style={styles.textoSecundario}>
          {mostrarBusca ? 'Fechar busca' : 'Buscar ação'}
        </Text>
      </Pressable>

      {mostrarBusca && (
        <View style={styles.busca}>
          <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Ex.: MGLU3"
            accessibilityLabel="Ticker da ação"
            autoCapitalize="characters"
            autoCorrect={false}
            style={styles.input}
          />
          <Pressable
            accessibilityRole="button"
            onPress={adicionarAcao}
            disabled={carregando}
            style={({ pressed }) => [styles.botao, (pressed || carregando) && styles.apagado]}
          >
            <Text style={styles.textoPrincipal}>Adicionar</Text>
          </Pressable>
        </View>
      )}

      {erro !== '' && <Text accessibilityRole="alert" style={styles.aviso}>{erro}</Text>}

      <Pressable
        accessibilityRole="button"
        onPress={onSettingScreen}
        style={({ pressed }) => [styles.botao, styles.secundario, pressed && styles.apagado]}
      >
        <Text style={styles.textoSecundario}>Configurações</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={sair}
        style={({ pressed }) => [styles.botao, styles.secundario, pressed && styles.apagado]}
      >
        <Text style={styles.textoSecundario}>Sair</Text>
      </Pressable>

      {mensagemErro !== '' && (
        <Text accessibilityRole="alert" style={styles.aviso}>{mensagemErro}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: '#FFF8EC' },
  conteudo: { width: '100%', maxWidth: 560, alignSelf: 'center', padding: 20, gap: 12 },
  titulo: { fontSize: 26, fontWeight: 'bold', color: '#352018' },
  tabela: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E7D4C5',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 12,
  },
  cabecalho: { backgroundColor: '#FFE7BE' },
  divisoria: { borderTopWidth: 1, borderColor: '#E7D4C5' },
  celula: { width: '30%', textAlign: 'center', alignItems: 'center', color: '#352018' },
  rotulo: { fontWeight: 'bold', color: '#352018' },
  nome: { fontSize: 12, color: '#6B4E3F', textAlign: 'center' },
  alta: { color: '#166534' },
  queda: { color: '#A12530' },
  botao: {
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#812703',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secundario: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E7D4C5' },
  textoPrincipal: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  textoSecundario: { color: '#812703', fontSize: 16, fontWeight: '600' },
  apagado: { opacity: 0.65 },
  busca: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#E7D4C5',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
  },
  aviso: { backgroundColor: '#FDE8E8', color: '#8B1A1A', padding: 12, borderRadius: 6 },
});
