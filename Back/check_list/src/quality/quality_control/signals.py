from django.core.signals import request_finished
from django.dispatch import receiver

from quality.quality_control.load import save_pdf
from quality.quality_control.service_logic import FullGet

#
# @receiver(request_finished)
# def save_pdf_xlsx(sender, **kwargs):
#     pk = self.kwargs.get('pk')
#     response_data = FullGet(self.request.user).get_data(pk)  # получаем данные, которые в дальнейшем запишем
#     if response_data == '403':
#         return Response('You do not have permission to perform this action.', status=HTTP_403_FORBIDDEN)
#     else:
#         try:
#             creater = f'{self.request.user.first_name} {self.request.user.last_name}'
#             Quality_control.objects.get(id=pk, time_deleted__isnull=True)
#             save_pdf(response_data, pk, creater)