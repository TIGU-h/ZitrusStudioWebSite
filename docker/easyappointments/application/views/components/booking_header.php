<?php
/**
 * Local variables.
 *
 * @var string $company_name
 */
?>

<div id="header" class="overflow-hidden p-3 p-md-4 d-flex flex-column flex-lg-row align-items-center bg-primary">
    <div id="company-name" class="d-block d-md-inline-block float-md-start text-center text-md-start text-white fs-4 fw-light my-3 my-md-0 mw-100 flex-grow-1" style="min-width: 0; line-height: 1.4;">
        <img src="<?= e(vars('company_logo') ?: base_url('assets/img/logo.png')) ?>" alt="logo" id="company-logo"
             class="d-block d-md-inline-block mx-auto mx-md-0 float-md-start me-md-3 mb-3 mb-md-0" style="max-height: 56px;">

        <span>
            <?= e($company_name) ?>
        </span>

        <div class="d-flex justify-content-center justify-content-md-start">
            <span class="display-booking-selection small fw-normal text-white-50">
                <?= lang('category') ?> │ <?= lang('service') ?> │ <?= lang('provider') ?>
            </span>
        </div>
    </div>

    <div id="steps" class="booking-progress mx-auto my-3 my-md-1" aria-label="<?= e(lang('service')) ?>">
        <?php
        $booking_steps = [
            lang('category'),
            lang('service'),
            lang('provider'),
            lang('appointment_date_and_time'),
            lang('customer_information'),
            lang('appointment_confirmation'),
        ];
        ?>
        <?php foreach ($booking_steps as $index => $step_title): ?>
            <div id="step-<?= $index + 1 ?>"
                 class="book-step<?= $index === 0 ? ' active-step' : '' ?>"
                 data-tippy-content="<?= e($step_title) ?>">
                <strong><?= $index + 1 ?></strong>
            </div>
        <?php endforeach; ?>
    </div>
</div>
