import unittest

from app import create_app
from app.models.comanda import Atendimento, Comanda, Produto
from app.utils.modules import db


class RouteTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app()
        self.app.config.update(
            TESTING=True,
            SECRET_KEY="test-secret",
            SQLALCHEMY_DATABASE_URI="sqlite:///:memory:",
        )
        self.context = self.app.app_context()
        self.context.push()
        db.create_all()
        self.client = self.app.test_client()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.context.pop()

    def login(self):
        response = self.client.post(
            "/atendentes/register", json={"password": "secret"}
        )
        self.assertEqual(response.status_code, 201)
        response = self.client.post(
            "/atendentes/login", json={"id": 1, "password": "secret"}
        )
        self.assertEqual(response.status_code, 200)

    def test_protected_route_requires_login(self):
        response = self.client.post("/atendimentos/", json={})
        self.assertEqual(response.status_code, 401)

    def test_atendente_register_login_update_and_delete(self):
        response = self.client.post(
            "/atendentes/register", json={"password": "secret"}
        )
        self.assertEqual(response.status_code, 201)
        response = self.client.post(
            "/atendentes/login", json={"id": 1, "password": "secret"}
        )
        self.assertEqual(response.status_code, 200)
        response = self.client.patch(
            "/atendentes/update", json={"id": 1, "password": "new-secret"}
        )
        self.assertEqual(response.status_code, 200)
        response = self.client.delete("/atendentes/delete", json={"id": 1})
        self.assertEqual(response.status_code, 200)

    def test_atendimento_comanda_produtos_pagamento_and_finalizacao(self):
        self.login()
        response = self.client.post("/atendimentos/", json={})
        self.assertEqual(response.status_code, 201)
        atendimento = Atendimento.query.one()
        comanda = Comanda.query.one()

        response = self.client.post(
            "/atendimentos/comandas",
            json={"id_atendimento": atendimento.id, "valor_a_pagar": 10},
        )
        self.assertEqual(response.status_code, 201)
        response = self.client.patch(
            "/atendimentos/comandas",
            json={
                "c_id": comanda.id,
                "prods": [{"nome": "Cafe", "preco": 7.5}],
            },
        )
        self.assertEqual(response.status_code, 200)
        response = self.client.put(
            "/atendimentos/comandas", json={"id": comanda.id, "valor": 3}
        )
        self.assertEqual(response.status_code, 200)
        response = self.client.put(
            "/atendimentos/", json={"id": atendimento.id}
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Produto.query.count(), 1)
        self.assertIsNotNone(Atendimento.query.one().fim)

    def test_invalid_registration_returns_json_error(self):
        response = self.client.post("/atendentes/register", json={})
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response.json)


if __name__ == "__main__":
    unittest.main()
