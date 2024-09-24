# from django.core.exceptions import ValidationError
# from rest_framework.reverse import reverse
# from rest_framework.test import APITestCase
#
# from .models import Service_device, Service_method
# from .serializers import Service_deviceSerializer, Service_methodSerializer
# from . import views as device_service_method_views
# from .service_logics import GetServiceMethodDeviceForService, DeviceMethodGetForService
# from ..methods.models import Method
# from ..services.models import Service
# from ..services.serializers import ServiceSerializer
#
#
# class TestField(APITestCase):
#
#     def setUp(self) -> None:
#         self.service = Service.objects.create(name='Service_1')
#         self.method = Method.objects.create(name='Method_1', method_class='Method_class_1')
#
#         self.device_1_attributes = {'tool_type': 'Tool_type_1'}
#         self.device = Service_device.objects.create(**self.device_1_attributes)
#         lst = [
#             Service_device(tool_type='Tool_type_2'),
#             Service_device(tool_type='Tool_type_3'),
#         ]
#         Service_device.objects.bulk_create(lst)
#         self.serializer_service_device = Service_deviceSerializer(instance=self.device_1_attributes)
#         self.service_method = Service_method.objects.create(service=self.service, service_device=self.device, method=self.method)
#         lst = [
#             Service_method(service=self.service, service_device=Service_device.objects.get(tool_type='Tool_type_2'),
#                            method=self.method),
#             Service_method(service=self.service, service_device=Service_device.objects.get(tool_type='Tool_type_3'),
#                            method=self.method),
#         ]
#         Service_method.objects.bulk_create(lst)
#
#     def test_model_field_duplicate(self):
#         service_device = Service_device(tool_type='Tool_type_1')
#         with self.assertRaises(ValidationError):
#             service_device.full_clean()
#
#     def test_model_field_max_length(self):
#         device = Service_device.objects.get(id=self.device.pk)
#         max_length = device._meta.get_field('tool_type').max_length
#         self.assertEquals(max_length, 120)
#
#     def test_model_service_method_device(self):
#         service_method = Service_method.objects.get(id=self.service_method.pk)
#         self.assertEqual(self.method, service_method.method)
#         self.assertEqual(self.device, service_method.service_device)
#         self.assertEqual(self.service, service_method.service)
#
#         service = Service.objects.create(name='Service')
#         method = Method.objects.create(name='Method', method_class='Method_class')
#         device = Service_device.objects.create(tool_type='Tool_type')
#
#         service_method = Service_method.objects.create(
#             service=self.service, service_device=self.device,
#             method=method)
#         method.delete()
#         with self.assertRaises(Service_method.DoesNotExist):
#             Service_method.objects.get(id=service_method.pk)
#
#         service_method = Service_method.objects.create(
#             service=self.service, service_device=device,
#             method=self.method)
#         device.delete()
#         with self.assertRaises(Service_method.DoesNotExist):
#             Service_method.objects.get(id=service_method.pk)
#
#         service_method = Service_method.objects.create(
#             service=service, service_device=self.device,
#             method=self.method)
#         service.delete()
#         with self.assertRaises(Service_method.DoesNotExist):
#             Service_method.objects.get(id=service_method.pk)
#
#     def test_managers_service_method_service_device(self):
#         service_devices = [self.device.pk, Service_device.objects.get(tool_type='Tool_type_2').pk]
#         service_devices_manager = Service_device.objects_service.filter_service(service_devices)
#         service_devices_filter = Service_device.objects.filter(id__in=service_devices)
#         self.assertEqual(list(service_devices_filter), list(service_devices_manager))
#
#         services = self.service.pk
#         methods = self.method.pk
#         service_method_manager_for_device = Service_method.objects_service.filter_for_device(services, methods)
#         service_method_check_for_device = Service_method.objects.all().values('service_device')
#         self.assertEqual(list(service_method_manager_for_device), list(service_method_check_for_device))
#
#         services = self.service.pk
#         service_method_manager_for_method = Service_method.objects_service.filter_for_method(services)
#         service_method_check_for_method = Service_method.objects.all().values('method')
#         self.assertEqual(list(service_method_manager_for_method), list(service_method_check_for_method))
#
#         service_method_id = Service_method.objects.values_list('id', flat=True)
#         service_method_manager_all = Service_method.objects_service.filter_for_all_information(service_method_id)
#         service_method_check_all = Service_method.objects.all().values()
#         self.assertEqual(list(service_method_manager_all), list(service_method_check_all))
#
#     def test_serializer_contains_expected_fields(self):
#         data = self.serializer_service_device.data
#         self.assertEqual(set(data.keys()), set(['tool_type']))
#         self.assertEqual(data['tool_type'], self.device_1_attributes['tool_type'])
#
#     def test_service_method_create_view(self):
#         data = {"tool_type": "Tool_type_1"}
#         service = Service.objects.create(name='Service')
#         method = Method.objects.create(name='Method', method_class='Method_class')
#         responce_post = self.client.post(reverse('service_companies.service_method:create_view',
#                                                  kwargs={'pk_service': self.service.pk, 'pk_method': self.method.pk}),
#                                          data)
#         self.assertEqual(400, responce_post.status_code)
#         self.assertEqual('Service Method Already Exist', responce_post.data[0].title())
#         self.assertEqual(responce_post.resolver_match.func.__name__,
#                          device_service_method_views.Service_methodCreateView.as_view().__name__)
#
#         responce_post = self.client.post(reverse('service_companies.service_method:create_view',
#                                                  kwargs={'pk_service': service.pk, 'pk_method': method.pk}),
#                                          data)
#         self.assertEqual(201, responce_post.status_code)
#         service_method_check = Service_method.objects.get(service=service.pk, method=method.pk,
#                                                           service_device=self.device.pk)
#         self.assertEqual(Service_methodSerializer(service_method_check).data, dict(responce_post.data))
#
#         service_pk = service.pk
#         service.delete()
#         responce_post = self.client.post(reverse('service_companies.service_method:create_view',
#                                                  kwargs={'pk_service': service_pk, 'pk_method': method.pk}),
#                                          data)
#         self.assertEqual(404, responce_post.status_code)
#
#         method_pk = method.pk
#         method.delete()
#         responce_post = self.client.post(reverse('service_companies.service_method:create_view',
#                                                  kwargs={'pk_service': self.service.pk, 'pk_method': method_pk}),
#                                          data)
#
#         self.assertEqual(404, responce_post.status_code)
#
#     def test_service_device_view(self):
#         responce_get = self.client.get(reverse('service_companies.service_method:service_device_view',
#                                                kwargs={'pk_service': self.service.pk}))
#         # service_devices = Service_device.objects.all().values()
#         # self.assertEqual(list(service_devices), list(responce_get.data))
#
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          device_service_method_views.DeviceMethodViewForService.as_view().__name__)
#
#         service_methods = Service_method.objects.filter(service=self.service.pk)
#         service_method_dict = []
#         for service_method in service_methods:
#             full_get_service = DeviceMethodGetForService()
#             full_get_service.full_get_data(service_method.pk)
#             service_method_dict = service_method_dict + [full_get_service.service_method_dict]
#         self.assertEqual(list(service_method_dict), list(responce_get.data))
#
#     def test_single_service_device_view(self):
#         responce_get = self.client.get(reverse('service_companies.service_method:single_service_device_view',
#                                                kwargs={'pk': self.device.pk}))
#         service_devices = Service_device.objects.get(id=self.device.pk)
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(Service_deviceSerializer(service_devices).data, dict(responce_get.data))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          device_service_method_views.SingleService_deviceView.as_view().__name__)
#
#     def test_service_method_destroy_view(self):
#         service_method_create = Service_method.objects.create(service=self.service, service_device=self.device,
#                                                               method=self.method)
#         responce_delete = self.client.delete(
#             reverse('service_companies.service_method:single_service_method_destroy_view',
#                     kwargs={'pk': service_method_create.pk}))
#
#         self.assertEqual(204, responce_delete.status_code)
#         with self.assertRaises(Service_method.DoesNotExist):
#             Service_method.objects.get(id=service_method_create.pk)
#         self.assertEqual(responce_delete.resolver_match.func.__name__,
#                          device_service_method_views.SingleService_methodDestroyView.as_view().__name__)
#
#     def test_ull_data_of_services_methods_device_view(self):
#         full_data_of_services_methods_device = GetServiceMethodDeviceForService().data(self.service.pk)
#         responce_get = self.client.get(reverse('service_companies.service_method:full_data_services',
#                                                kwargs={'pk_service': self.service.pk}))
#
#         self.assertEqual(200, responce_get.status_code)
#
#         self.assertEqual(list(full_data_of_services_methods_device), list(responce_get.data))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          device_service_method_views.ServiceMethodDeviceViewForService.as_view().__name__)
#
#
#     def test_service_wellbore_full_data_services(self):
#         service_ligic = GetServiceMethodDeviceForService()
#         service_devices_get = service_ligic.service_device(self.method.pk, self.service.pk).order_by('id')
#         service_devices_check = Service_device.objects.all().values().order_by('id')
#         self.assertEqual(list(service_devices_get), list(service_devices_check))
#
#         another_method = self.method = Method.objects.create(name='Method_2', method_class='Method_class_2')
#         Service_method.objects.create(service=self.service, service_device=self.device,
#                                       method=another_method)
#
#         method_device_for_service = service_ligic.method_device(self.service.pk)
#
#         methods = Method.objects.all()
#         method_device = []
#         for method in methods.values():
#             method['device'] = list(service_ligic.service_device(method['id'], self.service.pk).values().order_by('id'))
#             method_device = method_device + [method]
#
#         self.assertEqual(list(method_device_for_service), list(method_device))
#
#         method_device_with_inform_service = service_ligic.data(self.service.pk)
#
#         service_dict = ServiceSerializer(self.service).data
#         service_dict['method'] = method_device
#
#         self.assertEqual(list(method_device_with_inform_service), list(service_dict))
#
#         does_not_exist = service_ligic.data(None)
#         self.assertEqual('Service Does Not Exist', does_not_exist['response'])
#
#     def get_for_full_post(self, service_logic):
#         service = service_logic.get_service(self.service.pk)
#         self.assertEqual(service, self.service)
#         service_logic.get_service(None)
#         self.assertEqual('Service Does Not Exist', service_logic.exception)
#
#         method = service_logic.method(self.method.pk)
#         self.assertEqual(method, self.method)
#         service_logic.method(None)
#         self.assertEqual('Method Does Not Exist', service_logic.exception)
#
#         device = service_logic.device(self.device.pk)
#         self.assertEqual(device, self.device)
#         service_logic.device(None)
#         self.assertEqual('Service device Does Not Exist', service_logic.exception)
#
#     def data_of_service_for_full_get(self, service_logic):
#         service_logic.service_data_for_full_get(None)
#         self.assertEqual('Service Does Not Exist', service_logic.exception)
#
#         service_logic.service_data_for_full_get(self.service.pk)
#         service_data = {'service_name': self.service.name, 'service_id': self.service.pk}
#         self.assertEqual(service_logic.service, service_data)
#         service_logic.service.clear()
#
#         return service_data
#
#     def data_of_method_device_for_full_get(self, service_logic):
#         service_logic.device_data_for_full_get(None)
#         self.assertEqual('Service device Does Not Exist', service_logic.exception)
#
#         service_logic.device_data_for_full_get(self.device.pk)
#         method_device_data = {'tool_type': self.device.tool_type, 'service_device_id': self.device.pk}
#         self.assertEqual(service_logic.service_method_dict, method_device_data)
#
#         service_logic.method_data_for_full_get(None)
#         self.assertEqual('Method Does Not Exist', service_logic.exception)
#
#         service_logic.method_data_for_full_get(self.method.pk)
#         method_device_data.update({'method': self.method.name, 'method_id': self.method.pk})
#         self.assertEqual(service_logic.service_method_dict, method_device_data)
#         service_logic.service_method_dict.clear()
#
#         return method_device_data
#
#     def test_service_full_get(self):
#         service_logic = DeviceMethodGetForService()
#         self.assertEqual(None, service_logic.exception)
#         self.assertEqual({}, service_logic.service_method_dict)
#         self.assertEqual({}, service_logic.service)
#
#         self.get_for_full_post(service_logic)
#         service = self.data_of_service_for_full_get(service_logic)
#         method_device = self.data_of_method_device_for_full_get(service_logic)
#
#         service_logic.full_get_data(None)
#         self.assertEqual('Service method Does Not Exist', service_logic.exception)
#         service_logic.full_get_data(self.service_method.pk)
#         self.assertEqual(service, service_logic.service)
#         self.assertEqual(method_device, service_logic.service_method_dict)