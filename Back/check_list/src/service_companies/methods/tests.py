# import json
#
# from django.core.exceptions import ValidationError
# from rest_framework.reverse import reverse
# from rest_framework.test import APITestCase
#
# from service_companies.methods.models import Method
# from service_companies.methods.serializers import MethodSerializer
# from . import views as method_views
# from ..service_method.models import Service_method
# from ..services.models import Service
#
#
# class TestField(APITestCase):
#
#     def setUp(self) -> None:
#         self.method_1_attributes = {'name': 'Method_1', 'method_class': 'Method_class_1'}
#         self.method = Method.objects.create(**self.method_1_attributes)
#         lst = [
#             Method(name='Method_2', method_class='Method_class_2'),
#             Method(name='Method_3', method_class='Method_class_3'),
#         ]
#         Method.objects.bulk_create(lst)
#
#         self.serializer = MethodSerializer(instance=self.method_1_attributes)
#
#     def test_model_field_duplicate(self):
#         method = Method(name='Method_1')
#         with self.assertRaises(ValidationError):
#             method.full_clean()
#
#     def test_model_field_max_length(self):
#         method = Method.objects.get(id=self.method.pk)
#         max_length = method._meta.get_field('name').max_length
#         self.assertEquals(max_length, 120)
#         max_length = method._meta.get_field('method_class').max_length
#         self.assertEquals(max_length, 120)
#
#     def test_serializer_contains_expected_fields(self):
#         data = self.serializer.data
#
#         self.assertEqual(set(data.keys()), set(['name', 'method_class']))
#         self.assertEqual(data['name'], self.method_1_attributes['name'])
#         self.assertEqual(data['method_class'], self.method_1_attributes['method_class'])
#
#     def test_all_method_view(self):
#         responce_get = self.client.get('/api/methods/')
#         methods = Method.objects.all().values()
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(list(methods), json.loads(json.dumps(responce_get.data)))
#         self.assertEqual(responce_get.resolver_match.func.__name__, method_views.MethodALLView.as_view().__name__)
#
#     def test_method_service_view(self):
#         service = Service.objects.create(name='Service_1')
#         responce_get = self.client.get(reverse('service_companies.method:service_method',
#                                                kwargs={'pk_service': service.pk}))
#         service_methods = Service_method.objects.filter(service=service).values('method')
#         methods = Method.objects.filter(id__in=service_methods)
#
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(list(methods), json.loads(json.dumps(responce_get.data)))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          method_views.MethodView.as_view().__name__)