import { useState } from 'react';
import { Button, ScrollView, Text, TextInput, View } from 'react-native';
import { buscarCotacoes, type Cotacao } from './services/brapi';
import { auth } from './services/firebase';
import { signOut } from 'firebase/auth/web-extension';

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
    <ScrollView contentContainerStyle={{ padding: 20, gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Cotações da B3</Text>
      <Button title="Sair" onPress={sair} />

      <Button
        title="Consultar cotações"
        onPress={() => consultar(acoes)}
        disabled={carregando}
      />

      <Button
        title={mostrarBusca ? 'Fechar busca' : 'Buscar ação'}
        onPress={() => setMostrarBusca(!mostrarBusca)}
      />

      {mostrarBusca && (
        <View style={{ gap: 8 }}>
            <TextInput
            value={busca}
            onChangeText={setBusca}
            placeholder="Ex.: MGLU3"
            accessibilityLabel="Ticker da ação"
            autoCapitalize="characters"
            autoCorrect={false}
            style={{ borderWidth: 1, padding: 8 }}
          />
          <Button
            title="Adicionar"
            onPress={adicionarAcao}
            disabled={carregando}
          />
        </View>
      )}

       <View>
            <Button
            title="Configurações"
            onPress={onSettingScreen}
            />
        </View>

      {carregando && <Text>Consultando...</Text>}
      {erro !== '' && <Text style={{ color: '#b00020' }}>{erro}</Text>}

      {acoes.map((ticker) => {
        const dados = cotacoes[ticker]?.data;

        return (
          <View
            key={ticker}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              gap: 12,
              paddingVertical: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: 'bold' }}>{ticker}</Text>
              {dados?.longName && <Text>{dados.longName}</Text>}
            </View>

            {dados ? (
              <View style={{ alignItems: 'flex-end' }}>
                <Text>{moeda.format(dados.regularMarketPrice)}</Text>
                <Text>
                  {dados.regularMarketChangePercent > 0 ? '+' : ''}
                  {dados.regularMarketChangePercent.toLocaleString('pt-BR', {
                    maximumFractionDigits: 2,
                  })}%
                </Text>
              </View>
            ) : (
              <Text>Sem cotação</Text>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}