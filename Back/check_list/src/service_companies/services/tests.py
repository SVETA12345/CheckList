# import json
#
# from django.core.exceptions import ValidationError
# from rest_framework.reverse import reverse
# from rest_framework.test import APITestCase
#
# from .models import Service
# from .serializers import ServiceSerializer
# from . import views as service_views
#
#
# class TestField(APITestCase):
#
#     def setUp(self) -> None:
#         self.service_1_attributes = {'name': 'Service_1'}
#         self.service = Service.objects.create(**self.service_1_attributes)
#         lst = [
#             Service(name='Service_2'),
#             Service(name='Service_3'),
#         ]
#         Service.objects.bulk_create(lst)
#
#         self.serializer = ServiceSerializer(instance=self.service_1_attributes)
#
#     def test_model_field_duplicate(self):
#         well = Service(name='Service_1')
#         with self.assertRaises(ValidationError):
#             well.full_clean()
#
#     def test_model_field_max_length(self):
#         service = Service.objects.get(id=self.service.pk)
#         max_length = service._meta.get_field('name').max_length
#         self.assertEquals(max_length, 120)
#
#     def test_serializer_contains_expected_fields(self):
#         data = self.serializer.data
#
#         self.assertEqual(set(data.keys()), set(['name']))
#         self.assertEqual(data['name'], self.service_1_attributes['name'])
#
#     def test_service_view(self):
#         responce_get = self.client.get('/api/services/')
#         services = Service.objects.all().values()
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(list(services), json.loads(json.dumps(responce_get.data)))
#         self.assertEqual(responce_get.resolver_match.func.__name__, service_views.ServiceView.as_view().__name__)
#
#         data = {'name': 'Service'}
#         responce_post = self.client.post('/api/services/', data)
#         self.assertEqual(201, responce_post.status_code)
#         service_create = Service.objects.get(name='Service')
#         service_post = Service(**data)
#         self.assertEqual(service_post.name, service_create.name)
#         self.assertEqual(responce_post.resolver_match.func.__name__, service_views.ServiceView.as_view().__name__)
#
#     def test_single_service_view(self):
#         responce_get = self.client.get(reverse('service_companies.services:service',
#                                                kwargs={'pk': self.service.pk}))
#         service = Service.objects.get(id=self.service.pk)
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(ServiceSerializer(service).data, dict(responce_get.data))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          service_views.SingleServiceView.as_view().__name__)
#
#         service_create = Service.objects.create(name='Service')
#         data = {'name': 'Service_4'}
#         responce_put = self.client.put(reverse('service_companies.services:service',
#                                                kwargs={'pk': service_create.pk}), data)
#         self.assertEqual(200, responce_put.status_code)
#         self.assertNotEqual(ServiceSerializer(service_create).data, dict(responce_get.data))
#         self.assertEqual(responce_put.resolver_match.func.__name__,
#                          service_views.SingleServiceView.as_view().__name__)
#
#         responce_delete = self.client.delete(reverse('service_companies.services:service',
#                                                      kwargs={'pk': service_create.pk}))
#         self.assertEqual(204, responce_delete.status_code)
#         self.assertEqual(responce_delete.resolver_match.func.__name__,
#                          service_views.SingleServiceView.as_view().__name__)
#         with self.assertRaises(Service.DoesNotExist):
#             Service.objects.get(id=service_create.pk)
