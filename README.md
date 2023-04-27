##Requisitos Funcionais(RF)
[X] O usuário deve poder criar uma conta;
[X] O usuário deve poder obter um extrato da sua conta;
[X] O usuário deve poder listar todas transações que já ocorreram;
[X] O usuário deve poder visualizar uma transação única;

##Regras de Negócios(RN)
[X] A transação pode do tipo crédito que somará ao valor total, ou débito que será subtraído;
[] Deve ser possível identificar o usuário entre as requisições;
[] O usuário só pode visualizar transações que ele criou;
Regras Não Funcionais(RNF)
[] Será criado ao longo da aplicação;# IgniteNode02

##Tests

- Units: application unit
- Integration: comunication between two or more units
- E2E: simulate user operation in our application
